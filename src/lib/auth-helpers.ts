/**
 * Utilitários server-side para verificação de permissões em API Routes
 * Use estas funções para proteger endpoints da API
 *
 * ⚠️ IMPORTANTE: Execute `yarn db:generate` após criar os models de Organization
 */
import { auth, AuthMember, AuthSession } from '@/src/lib/auth';
import {
  hasPermission,
  type Permission,
  type Role,
} from '@/src/lib/permissions';
import prisma from '@/src/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export type Session = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  session: {
    activeOrganizationId?: string;
  };
} & AuthSession;

export type Member = {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: Date;
  organization: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    createdAt: Date;
    metadata: string | null;
  };
} & AuthMember;

/**
 * Verifica se o usuário está autenticado
 *
 * @returns Sessão do usuário ou null
 */
export async function getAuthSession(): Promise<Session | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session as Session | null;
  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    return null;
  }
}

/**
 * Verifica se o usuário tem permissão para acessar um recurso
 *
 * @param permission - Permissão necessária
 * @returns Objeto com dados de autorização ou resposta de erro
 *
 * @example
 * export async function POST(request: Request) {
 *   const authResult = await requirePermission('members:invite');
 *
 *   if (!authResult.authorized) {
 *     return authResult.response;
 *   }
 *
 *   // Continue com a lógica...
 * }
 */
export async function requirePermission(permission: Permission): Promise<
  | {
      authorized: true;
      session: AuthSession;
      member: Member;
      organization: Member['organization'];
    }
  | { authorized: false; response: NextResponse }
> {
  // 1. Verifica autenticação
  const session = (await getAuthSession()) as Session | null;

  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      ),
    };
  }

  // 2. Verifica se há organization ativa
  const activeOrgId = session.session.activeOrganizationId;

  if (!activeOrgId) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Nenhuma organização ativa' },
        { status: 403 }
      ),
    };
  }

  // 3. Busca member e role do usuário na organization
  const member = (await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: activeOrgId,
    },
    include: {
      organization: true,
    },
  })) as Member | null;

  if (!member) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Você não é membro desta organização' },
        { status: 403 }
      ),
    };
  }

  // 4. Verifica permissão
  const userRole = member.role as Role;

  if (!hasPermission(userRole, permission)) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error: 'Permissão negada',
          required: permission,
          current: userRole,
        },
        { status: 403 }
      ),
    };
  }

  // 5. Retorna autorização bem-sucedida
  return {
    authorized: true,
    session,
    member,
    organization: member.organization,
  };
}

/**
 * Verifica se o usuário tem role mínimo necessário
 *
 * @param requiredRole - Role mínimo necessário
 * @returns Objeto com dados de autorização ou resposta de erro
 */
export async function requireRole(requiredRole: Role): Promise<
  | {
      authorized: true;
      session: Session;
      member: Member;
      organization: Member['organization'];
    }
  | { authorized: false; response: NextResponse }
> {
  const session = await getAuthSession();

  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      ),
    };
  }

  const activeOrgId = session.session.activeOrganizationId;

  if (!activeOrgId) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Nenhuma organização ativa' },
        { status: 403 }
      ),
    };
  }

  // Busca member e role do usuário na organization
  const member = (await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: activeOrgId,
    },
    include: {
      organization: true,
    },
  })) as Member | null;

  if (!member) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Você não é membro desta organização' },
        { status: 403 }
      ),
    };
  }

  if (member.role !== requiredRole) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error: 'Role insuficiente',
          required: requiredRole,
          current: member.role,
        },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    session,
    member,
    organization: member.organization,
  };
}

/**
 * Verifica apenas autenticação (sem verificar organization ou permissões)
 */
export async function requireAuth(): Promise<
  | { authorized: true; session: Session }
  | { authorized: false; response: NextResponse }
> {
  const session = await getAuthSession();

  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      ),
    };
  }

  return {
    authorized: true,
    session,
  };
}

// export function getErrorMessage(error: unknown) {
//   const errorMessages: Record<string, string> = {
//     USER_NOT_FOUND: 'E-mail ou senha incorretos.',
//     USER_ALREADY_EXISTS: 'Este e-mail já está cadastrado.',
//     INVALID_EMAIL: 'Por favor, insira um e-mail válido.',
//   };
//   return errorMessages[error] || 'Ocorreu um erro inesperado.';
// }
