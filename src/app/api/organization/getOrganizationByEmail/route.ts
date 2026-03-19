import prisma from '@/src/lib/prisma';
import { NextRequest } from 'next/server';

/**
 * GET /api/organization/getOrganizationByEmail?email=user@example.com
 * Retorna todas as organizações que um usuário pertence
 */
export async function GET(req: NextRequest) {
  try {
    // Obtém o email dos query parameters
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email é obrigatório' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Busca o usuário e suas organizações
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        members: {
          include: {
            organization: true,
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
    }));

    return new Response(JSON.stringify({ organizations }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao buscar organizações:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
