import { getSessionCookie } from 'better-auth/cookies';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Rotas públicas que não requerem autenticação
const PUBLIC_PATHS = [
  '/',
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/verify-email',
  '/reset-password',
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const sessionCookie = getSessionCookie(request);
  // const sessionToken = request.cookies.get('better-auth.session_token');

  // Verifica se a rota é pública
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // Se não tem token de sessão e não está em rota pública, redireciona para sign-in
  if (!sessionCookie && !isPublicPath) {
    console.log('Usuário não autenticado, redirecionando para sign-in');
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Permite continuar para a rota
  return NextResponse.next();
}

export const config = {
  // Aplica o proxy para todas as rotas exceto arquivos estáticos e API routes
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
  ],
};
