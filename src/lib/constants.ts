/**
 * Constantes da aplicação
 * Centraliza valores fixos e configurações reutilizáveis
 */

/**
 * Configurações de Email
 */
export const EMAIL_CONFIG = {
  // Remetente padrão para todos os emails
  FROM: process.env.EMAIL_FROM || 'onboarding@resend.dev',

  // Nome de exibição do remetente
  FROM_NAME: process.env.EMAIL_FROM_NAME || 'Minha Aplicação',

  // Email de reply-to
  REPLY_TO: process.env.EMAIL_REPLY_TO,
} as const;

/**
 * Assuntos de Email (templates)
 */
export const EMAIL_SUBJECTS = {
  VERIFY_EMAIL: 'Verifique seu email',
  RESET_PASSWORD: 'Redefinir sua senha',
  PASSWORD_CHANGED: 'Sua senha foi alterada',
  WELCOME: 'Bem-vindo(a)!',
} as const;

/**
 * URLs da aplicação
 */
const BASE_URL = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

export const APP_URLS = {
  BASE: BASE_URL,
  VERIFY_EMAIL: (token: string) => `${BASE_URL}/verify-email?token=${token}`,
  RESET_PASSWORD: (token: string) =>
    `${BASE_URL}/reset-password?token=${token}`,
  LOGIN: `${BASE_URL}/sign-in`,
} as const;

/**
 * Tempos de expiração
 */
export const EXPIRATION_TIMES = {
  EMAIL_VERIFICATION: 60 * 60 * 24, // 24 horas em segundos
  PASSWORD_RESET: 60 * 60, // 1 hora em segundos
} as const;

/**
 * Mensagens de erro comuns
 */
export const ERROR_MESSAGES = {
  EMAIL_SEND_FAILED: 'Falha ao enviar email. Tente novamente mais tarde.',
  INVALID_TOKEN: 'Token inválido ou expirado.',
  EMAIL_NOT_VERIFIED: 'Por favor, verifique seu email antes de fazer login.',
} as const;

/**
 * Mensagens de sucesso
 */
export const SUCCESS_MESSAGES = {
  EMAIL_SENT: 'Email enviado com sucesso! Verifique sua caixa de entrada.',
  EMAIL_VERIFIED: 'Email verificado com sucesso!',
  PASSWORD_RESET: 'Senha redefinida com sucesso!',
} as const;
