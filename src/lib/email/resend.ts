/**
 * Configuração e funções para envio de emails com Resend
 */

import { Resend } from 'resend';
import {
  APP_URLS,
  EMAIL_CONFIG,
  EMAIL_SUBJECTS,
  ERROR_MESSAGES,
} from '../constants';
import {
  PasswordChangedTemplate,
  ResetPasswordTemplate,
  VerifyEmailTemplate,
} from './templates';

// Inicializa o cliente Resend
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Tipos para as opções de envio de email
 */
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  from?: string;
}

/**
 * Função genérica para enviar emails
 * @throws Error se o envio falhar
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo = EMAIL_CONFIG.REPLY_TO,
  from = `${EMAIL_CONFIG.FROM_NAME} <${EMAIL_CONFIG.FROM}>`,
}: SendEmailOptions) {
  try {
    // Valida se a API key está configurada
    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        'RESEND_API_KEY não está configurada nas variáveis de ambiente'
      );
    }

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      ...(replyTo && { replyTo }),
    });

    if (error) {
      console.error('Erro ao enviar email:', error);
      throw new Error(ERROR_MESSAGES.EMAIL_SEND_FAILED);
    }

    console.log('Email enviado com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
}

/**
 * Envia email de verificação de conta
 * @param email - Email do destinatário
 * @param tokenOrUrl - Token ou URL completa de verificação
 * @param userName - Nome do usuário (opcional)
 */
export async function sendVerificationEmail(
  email: string,
  tokenOrUrl: string,
  userName?: string
) {
  // Se tokenOrUrl começa com http:// ou https://, é uma URL completa
  const verificationUrl = tokenOrUrl.startsWith('http')
    ? tokenOrUrl
    : APP_URLS.VERIFY_EMAIL(tokenOrUrl);

  const html = VerifyEmailTemplate({
    userName,
    verificationUrl,
  });

  return sendEmail({
    to: email,
    subject: EMAIL_SUBJECTS.VERIFY_EMAIL,
    html,
  });
}

/**
 * Envia email de redefinição de senha
 * @param email - Email do destinatário
 * @param tokenOrUrl - Token ou URL completa de redefinição
 * @param userName - Nome do usuário (opcional)
 */
export async function sendPasswordResetEmail(
  email: string,
  tokenOrUrl: string,
  userName?: string
) {
  // Se tokenOrUrl começa com http:// ou https://, é uma URL completa
  const resetUrl = tokenOrUrl.startsWith('http')
    ? tokenOrUrl
    : APP_URLS.RESET_PASSWORD(tokenOrUrl);

  const html = ResetPasswordTemplate({
    userName,
    resetUrl,
  });

  return sendEmail({
    to: email,
    subject: EMAIL_SUBJECTS.RESET_PASSWORD,
    html,
  });
}

/**
 * Envia email de confirmação de alteração de senha
 */
export async function sendPasswordChangedEmail(
  email: string,
  userName?: string
) {
  const html = PasswordChangedTemplate({
    userName,
  });

  return sendEmail({
    to: email,
    subject: EMAIL_SUBJECTS.PASSWORD_CHANGED,
    html,
  });
}

/**
 * Tipo auxiliar para retorno de funções de email
 */
export type EmailResult = {
  success: boolean;
  error?: string;
};

/**
 * Wrapper seguro para envio de emails que não lança exceções
 * Útil para casos onde o envio de email não deve bloquear a operação principal
 */
export async function sendEmailSafely(
  emailFn: () => Promise<unknown>
): Promise<EmailResult> {
  try {
    await emailFn();
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar email (modo seguro):', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.EMAIL_SEND_FAILED,
    };
  }
}

/**
 * Utilitário para enviar múltiplos emails em lote
 */
export async function sendBatchEmails(
  emails: SendEmailOptions[]
): Promise<EmailResult[]> {
  const results = await Promise.allSettled(
    emails.map((emailOptions) => sendEmail(emailOptions))
  );

  return results.map((result) => {
    if (result.status === 'fulfilled') {
      return { success: true };
    } else {
      return {
        success: false,
        error: result.reason?.message || ERROR_MESSAGES.EMAIL_SEND_FAILED,
      };
    }
  });
}

export { resend };
