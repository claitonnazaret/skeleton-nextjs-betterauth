/**
 * Exemplo de rota API para envio de emails
 * Demonstra como usar as funções de email manualmente
 *
 * Endpoints disponíveis:
 * - POST /api/email/send-verification
 * - POST /api/email/send-password-reset
 * - POST /api/email/send-password-changed
 * - POST /api/email/send-custom
 */

import { auth } from '@/src/lib/auth';
import { sendVerificationEmail } from '@/src/lib/email';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/email/send-verification
 * Envia email de verificação
 */
export async function POST(request: NextRequest) {
  try {
    // Verifica se o usuário está autenticado (opcional)
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { email, token, userName } = body;

    // Validações básicas
    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email e token são obrigatórios' },
        { status: 400 }
      );
    }

    // Envia o email
    await sendVerificationEmail(email, token, userName);

    return NextResponse.json({
      success: true,
      message: 'Email de verificação enviado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao enviar email de verificação:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Falha ao enviar email',
      },
      { status: 500 }
    );
  }
}

// Exemplo de uso:
/*
fetch('/api/email/send-verification', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@exemplo.com',
    token: 'abc123token',
    userName: 'João Silva'
  })
});
*/
