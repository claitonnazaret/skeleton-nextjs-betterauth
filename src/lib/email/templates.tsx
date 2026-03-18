/**
 * Templates HTML para emails
 * Cada template é uma função que retorna HTML formatado
 */

import { APP_URLS } from '../constants';

/**
 * Tipos para os parâmetros dos templates
 */
export interface VerifyEmailTemplateProps {
  userName?: string;
  verificationUrl: string;
}

export interface ResetPasswordTemplateProps {
  userName?: string;
  resetUrl: string;
}

export interface PasswordChangedTemplateProps {
  userName?: string;
}

/**
 * Layout base para todos os emails
 */
const EmailLayout = ({ children }: { children: string }) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      font-size: 28px;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
    }
    .content p {
      margin-bottom: 20px;
      font-size: 16px;
      color: #555555;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
    }
    .button:hover {
      opacity: 0.9;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer p {
      margin: 5px 0;
      font-size: 14px;
      color: #6c757d;
    }
    .divider {
      height: 1px;
      background-color: #e9ecef;
      margin: 30px 0;
    }
    .warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .warning p {
      color: #856404;
      margin: 0;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    ${children}
    <div class="footer">
      <p>Este é um email automático, por favor não responda.</p>
      <p style="margin-top: 15px;">© ${new Date().getFullYear()} Minha Aplicação. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Template: Verificação de Email
 */
export const VerifyEmailTemplate = ({
  userName,
  verificationUrl,
}: VerifyEmailTemplateProps): string => {
  const greeting = userName ? `Olá, ${userName}!` : 'Olá!';

  return EmailLayout({
    children: `
      <div class="header">
        <h1>✉️ Verifique seu Email</h1>
      </div>
      <div class="content">
        <p>${greeting}</p>
        <p>Obrigado por se cadastrar! Para completar seu registro e começar a usar nossa plataforma, precisamos verificar seu endereço de email.</p>
        <p style="text-align: center;">
          <a href="${verificationUrl}" class="button">Verificar Meu Email</a>
        </p>
        <div class="divider"></div>
        <p style="font-size: 14px; color: #6c757d;">
          Ou copie e cole este link no seu navegador:
        </p>
        <p style="font-size: 14px; color: #667eea; word-break: break-all;">
          ${verificationUrl}
        </p>
        <div class="warning">
          <p><strong>⚠️ Atenção:</strong> Este link expira em 24 horas. Se você não solicitou este email, pode ignorá-lo com segurança.</p>
        </div>
      </div>
    `,
  });
};

/**
 * Template: Redefinir Senha
 */
export const ResetPasswordTemplate = ({
  userName,
  resetUrl,
}: ResetPasswordTemplateProps): string => {
  const greeting = userName ? `Olá, ${userName}!` : 'Olá!';

  return EmailLayout({
    children: `
      <div class="header">
        <h1>🔐 Redefinir Senha</h1>
      </div>
      <div class="content">
        <p>${greeting}</p>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta. Se você fez esta solicitação, clique no botão abaixo para criar uma nova senha:</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" class="button">Redefinir Minha Senha</a>
        </p>
        <div class="divider"></div>
        <p style="font-size: 14px; color: #6c757d;">
          Ou copie e cole este link no seu navegador:
        </p>
        <p style="font-size: 14px; color: #667eea; word-break: break-all;">
          ${resetUrl}
        </p>
        <div class="warning">
          <p><strong>⚠️ Importante:</strong> Este link expira em 1 hora. Se você não solicitou a redefinição de senha, ignore este email e sua senha permanecerá inalterada.</p>
        </div>
      </div>
    `,
  });
};

/**
 * Template: Senha Alterada (notificação)
 */
export const PasswordChangedTemplate = ({
  userName,
}: PasswordChangedTemplateProps): string => {
  const greeting = userName ? `Olá, ${userName}!` : 'Olá!';

  return EmailLayout({
    children: `
      <div class="header">
        <h1>✅ Senha Alterada</h1>
      </div>
      <div class="content">
        <p>${greeting}</p>
        <p>Estamos escrevendo para confirmar que a senha da sua conta foi alterada com sucesso.</p>
        <p>Se você fez esta alteração, não precisa fazer mais nada. Sua conta está segura e você pode fazer login com sua nova senha.</p>
        <div class="warning">
          <p><strong>⚠️ Você não reconhece esta alteração?</strong></p>
          <p style="margin-top: 10px;">Se você não alterou sua senha, sua conta pode estar comprometida. Entre em contato conosco imediatamente para que possamos ajudá-lo a proteger sua conta.</p>
        </div>
        <p style="text-align: center; margin-top: 30px;">
          <a href="${APP_URLS.LOGIN}" class="button">Fazer Login</a>
        </p>
      </div>
    `,
  });
};

/**
 * Template genérico para emails simples
 */
export const GenericEmailTemplate = ({
  title,
  content,
}: {
  title: string;
  content: string;
}): string => {
  return EmailLayout({
    children: `
      <div class="header">
        <h1>${title}</h1>
      </div>
      <div class="content">
        ${content}
      </div>
    `,
  });
};
