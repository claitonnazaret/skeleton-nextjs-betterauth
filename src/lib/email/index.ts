/**
 * Módulo de Email - Exportações principais
 * Centraliza todas as funções e tipos relacionados a email
 */

// Funções principais de envio
export {
  resend,
  sendBatchEmails,
  sendEmail,
  sendEmailSafely,
  sendPasswordChangedEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  type EmailResult,
  type SendEmailOptions,
} from './resend';

// Templates
export {
  GenericEmailTemplate,
  PasswordChangedTemplate,
  ResetPasswordTemplate,
  VerifyEmailTemplate,
  type PasswordChangedTemplateProps,
  type ResetPasswordTemplateProps,
  type VerifyEmailTemplateProps,
} from './templates';
