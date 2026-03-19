/**
 * Exemplo de API Route protegida com RBAC
 * Endpoint para convidar membros à organization
 *
 * POST /api/members/invite
 * Body: { email: string, role: 'owner' | 'admin' | 'member' }
 */
import { requirePermission } from '@/src/lib/auth-helpers';
import { ROLES, type Role } from '@/src/lib/permissions';
import prisma from '@/src/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. Verifica permissão 'members:invite'
  const authResult = await requirePermission('members:invite');

  if (!authResult.authorized) {
    return authResult.response;
  }

  // 2. Extrai dados da requisição
  const body = await request.json();
  const { email, role } = body;

  // 3. Valida dados
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
  }

  if (!role || !Object.values(ROLES).includes(role as Role)) {
    return NextResponse.json(
      { error: 'Role inválido. Use: owner, admin ou member' },
      { status: 400 }
    );
  }

  // 4. Verifica se o usuário já é membro
  // @ts-expect-error - Prisma client will have these models after db:generate
  const existingMember = await prisma.member.findFirst({
    where: {
      organizationId: authResult.organization.id,
      user: {
        email: email,
      },
    },
  });

  if (existingMember) {
    return NextResponse.json(
      { error: 'Este usuário já é membro da organização' },
      { status: 400 }
    );
  }

  // 5. Verifica se já existe convite pendente
  // @ts-expect-error - Prisma client will have these models after db:generate
  const existingInvitation = await prisma.invitation.findFirst({
    where: {
      organizationId: authResult.organization.id,
      email: email,
      status: 'pending',
    },
  });

  if (existingInvitation) {
    return NextResponse.json(
      { error: 'Já existe um convite pendente para este email' },
      { status: 400 }
    );
  }

  // @ts-expect-error - Prisma client will have these models after db:generate
  // 6. Cria o convite
  const invitation = await prisma.invitation.create({
    data: {
      id: crypto.randomUUID(),
      organizationId: authResult.organization.id,
      email: email,
      role: role,
      status: 'pending',
      inviterId: authResult.session.user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    },
  });

  // 7. TODO: Enviar email de convite
  // await sendInvitationEmail(email, invitation.id, authResult.organization.name);

  // 8. Retorna sucesso
  return NextResponse.json(
    {
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
      },
      message: 'Convite enviado com sucesso',
    },
    { status: 201 }
  );
}

/**
 * Listar convites pendentes da organization
 *
 * GET /api/members/invite
 */
export async function GET() {
  // Requer permissão para visualizar membros
  const authResult = await requirePermission('members:read');

  if (!authResult.authorized) {
    return authResult.response;
  }

  // @ts-expect-error - Prisma client will have these models after db:generate
  const invitations = await prisma.invitation.findMany({
    where: {
      organizationId: authResult.organization.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json({
    // @ts-expect-error - Prisma types not yet generated
    invitations: invitations.map((inv) => ({
      id: inv.id,
      email: inv.email,
      role: inv.role,
      status: inv.status,
      expiresAt: inv.expiresAt,
      createdAt: inv.createdAt,
    })),
  });
}
