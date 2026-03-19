import { auth } from '@/src/lib/auth';
import prisma from '@/src/lib/prisma';
import { NextRequest } from 'next/server';

/**
 * GET /api/organization/getUserOrganizations?userId=xxx
 * ou
 * GET /api/organization/getUserOrganizations (usa usuário autenticado)
 *
 * Retorna todas as organizações que um usuário pertence
 */
export async function GET(req: NextRequest) {
  try {
    // Obtém o userId dos query parameters ou da sessão
    const searchParams = req.nextUrl.searchParams;
    let userId = searchParams.get('userId');

    // Se não forneceu userId, tenta obter da sessão
    if (!userId) {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session) {
        return new Response(JSON.stringify({ error: 'Não autenticado' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      userId = session.user.id;
    }

    // Busca o usuário e suas organizações
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        members: {
          include: {
            organization: true,
          },
          orderBy: {
            createdAt: 'desc', // Mais recentes primeiro
          },
        },
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Mapeia os dados para retornar apenas as organizações com informações relevantes
    const organizations = user.members.map((member) => ({
      id: member.organization.id,
      name: member.organization.name,
      slug: member.organization.slug,
      logo: member.organization.logo,
      role: member.role,
      createdAt: member.organization.createdAt,
      metadata: member.organization.metadata,
      memberSince: member.createdAt,
      memberId: member.id,
    }));

    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        organizations,
        total: organizations.length,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erro ao buscar organizações:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
