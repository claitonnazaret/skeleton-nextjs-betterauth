# 📧 Sistema de Emails com Resend

Sistema completo de envio de emails integrado com Better Auth usando Resend.

## 📋 Índice

- [Configuração](#configuração)
- [Funcionalidades](#funcionalidades)
- [Uso](#uso)
- [Templates Disponíveis](#templates-disponíveis)
- [Exemplos](#exemplos)

## ⚙️ Configuração

### 1. Obter API Key do Resend

1. Acesse [https://resend.com](https://resend.com)
2. Crie uma conta ou faça login
3. Acesse **API Keys** no dashboard
4. Crie uma nova API key

### 2. Configurar Variáveis de Ambiente

Copie as variáveis do `.env.example` para seu arquivo `.env`:

```env
RESEND_API_KEY=re_sua_api_key_aqui
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=Minha Aplicação
EMAIL_REPLY_TO=contato@seudominio.com
```

**Nota:** Para desenvolvimento, use `onboarding@resend.dev`. Para produção, você precisa verificar seu domínio no Resend.

### 3. Verificar Domínio (Produção)

Para usar seu próprio domínio em produção:

1. Acesse **Domains** no dashboard do Resend
2. Adicione seu domínio
3. Configure os registros DNS conforme instruções
4. Aguarde a verificação
5. Atualize `EMAIL_FROM` com seu domínio verificado

## 🎯 Funcionalidades

O sistema oferece:

- ✅ **Verificação de Email** - Email de confirmação após cadastro
- 🔐 **Recuperação de Senha** - Email com link para redefinir senha
- 🔔 **Notificação de Senha Alterada** - Email de confirmação após mudança
- 🎨 **Templates HTML Responsivos** - Design profissional e mobile-friendly
- 🛡️ **Funções Seguras** - Tratamento de erros robusto
- 📦 **Envio em Lote** - Suporte para múltiplos emails

## 🚀 Uso

### Integração Automática com Better Auth

O sistema está **automaticamente integrado** com o Better Auth. Os emails são enviados automaticamente em:

- **Cadastro de usuário** → Email de verificação
- **Esqueci minha senha** → Email de recuperação
- **Troca de senha** → Email de confirmação (implementar manualmente)

### Uso Manual das Funções

```typescript
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendEmail,
} from '@/src/lib/email';

// Email de verificação
await sendVerificationEmail(
  'usuario@exemplo.com',
  'token_de_verificacao',
  'Nome do Usuário' // opcional
);

// Email de recuperação de senha
await sendPasswordResetEmail(
  'usuario@exemplo.com',
  'token_de_reset',
  'Nome do Usuário' // opcional
);

// Email de senha alterada
await sendPasswordChangedEmail(
  'usuario@exemplo.com',
  'Nome do Usuário' // opcional
);

// Email customizado
await sendEmail({
  to: 'usuario@exemplo.com',
  subject: 'Assunto do Email',
  html: '<h1>Conteúdo HTML</h1>',
});
```

### Envio Seguro (Não Bloqueia em Caso de Erro)

```typescript
import { sendEmailSafely, sendPasswordChangedEmail } from '@/src/lib/email';

// Envia email mas não lança exceção se falhar
const result = await sendEmailSafely(() =>
  sendPasswordChangedEmail('usuario@exemplo.com', 'João')
);

if (!result.success) {
  console.error('Erro ao enviar email:', result.error);
  // Continua a execução normalmente
}
```

### Envio em Lote

```typescript
import { sendBatchEmails } from '@/src/lib/email';

const emails = [
  {
    to: 'usuario1@exemplo.com',
    subject: 'Assunto 1',
    html: '<p>Conteúdo 1</p>',
  },
  {
    to: 'usuario2@exemplo.com',
    subject: 'Assunto 2',
    html: '<p>Conteúdo 2</p>',
  },
];

const results = await sendBatchEmails(emails);

results.forEach((result, index) => {
  if (!result.success) {
    console.error(`Email ${index + 1} falhou:`, result.error);
  }
});
```

## 🎨 Templates Disponíveis

### 1. Verificação de Email (`VerifyEmailTemplate`)

```typescript
import { VerifyEmailTemplate } from '@/src/lib/email/templates';

const html = VerifyEmailTemplate({
  userName: 'João Silva',
  verificationUrl: 'https://seusite.com/verify?token=abc123',
});
```

### 2. Redefinir Senha (`ResetPasswordTemplate`)

```typescript
import { ResetPasswordTemplate } from '@/src/lib/email/templates';

const html = ResetPasswordTemplate({
  userName: 'Maria Santos',
  resetUrl: 'https://seusite.com/reset-password?token=xyz789',
});
```

### 3. Senha Alterada (`PasswordChangedTemplate`)

```typescript
import { PasswordChangedTemplate } from '@/src/lib/email/templates';

const html = PasswordChangedTemplate({
  userName: 'Pedro Costa',
});
```

### 4. Template Genérico (`GenericEmailTemplate`)

```typescript
import { GenericEmailTemplate } from '@/src/lib/email/templates';

const html = GenericEmailTemplate({
  title: 'Bem-vindo!',
  content: '<p>Seu conteúdo HTML aqui...</p>',
});
```

## 📖 Exemplos

### Exemplo 1: Notificar Usuário Após Mudança de Senha

```typescript
// Em uma rota de API ou server action
import { sendPasswordChangedEmail } from '@/src/lib/email';

export async function changePassword(userId: string, newPassword: string) {
  // ... lógica para trocar senha ...

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user) {
    // Notifica o usuário
    await sendPasswordChangedEmail(user.email, user.name || undefined);
  }
}
```

### Exemplo 2: Email Customizado

```typescript
import { sendEmail } from '@/src/lib/email';
import { GenericEmailTemplate } from '@/src/lib/email/templates';

const html = GenericEmailTemplate({
  title: 'Nova Funcionalidade!',
  content: `
    <p>Olá,</p>
    <p>Temos novidades para você!</p>
    <ul>
      <li>Recurso 1</li>
      <li>Recurso 2</li>
    </ul>
  `,
});

await sendEmail({
  to: 'usuario@exemplo.com',
  subject: 'Novidades da Plataforma',
  html,
});
```

### Exemplo 3: Envio em Background (Não Bloqueia)

```typescript
import { sendEmailSafely, sendVerificationEmail } from '@/src/lib/email';

export async function createUser(data: any) {
  // Cria o usuário
  const user = await prisma.user.create({ data });

  // Envia email sem bloquear (não lança exceção)
  sendEmailSafely(() =>
    sendVerificationEmail(user.email, generateToken(), user.name || undefined)
  );

  // Retorna imediatamente
  return user;
}
```

## 🔧 Personalização

### Customizar Templates

Para customizar os templates, edite o arquivo `templates.tsx`:

1. Modifique o `EmailLayout` para mudar o design base
2. Personalize cada template individual
3. Ajuste cores no CSS inline
4. Adicione seu logo na seção do header

### Adicionar Novos Templates

```typescript
// src/lib/email/templates.tsx

export interface NovoTemplateProps {
  userName: string;
  // ... outros props
}

export const NovoTemplate = ({ userName }: NovoTemplateProps): string => {
  return EmailLayout({
    children: `
      <div class="header">
        <h1>Título do Email</h1>
      </div>
      <div class="content">
        <p>Olá, ${userName}!</p>
        <!-- Seu conteúdo aqui -->
      </div>
    `,
  });
};
```

### Adicionar Novas Funções de Envio

```typescript
// src/lib/email/resend.ts

export async function sendNovoTipoEmail(
  email: string,
  param: string,
  userName?: string
) {
  const html = NovoTemplate({ userName, param });

  return sendEmail({
    to: email,
    subject: 'Assunto do Novo Email',
    html,
  });
}
```

## 🐛 Troubleshooting

### "RESEND_API_KEY não está configurada"

- Verifique se a variável está no arquivo `.env`
- Certifique-se de que não há espaços extras
- Reinicie o servidor de desenvolvimento

### Emails não estão chegando

1. Verifique o spam/lixo eletrônico
2. Confira os logs do console para erros
3. Verifique o dashboard do Resend para status de envio
4. Em desenvolvimento, use `onboarding@resend.dev`
5. Em produção, verifique se seu domínio está configurado

### Erro de domínio não verificado

- Em produção, você precisa verificar seu domínio no Resend
- Em desenvolvimento, use `onboarding@resend.dev`

## 📚 Recursos Adicionais

- [Documentação Resend](https://resend.com/docs)
- [Documentação Better Auth](https://better-auth.com/docs)
- [Dashboard Resend](https://resend.com/dashboard)

## 🤝 Contribuindo

Para adicionar novos templates ou funcionalidades:

1. Adicione o template em `templates.tsx`
2. Crie a função de envio em `resend.ts`
3. Exporte no `index.ts`
4. Atualize esta documentação

---

**💡 Dica:** Use o modo de desenvolvimento do Resend para testar emails sem consumir seu limite de envios.
