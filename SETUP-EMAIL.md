# 🚀 Configuração Rápida - Sistema de Emails

Guia passo a passo para configurar o sistema de envio de emails com Resend.

## 📋 Pré-requisitos

- Conta no [Resend](https://resend.com)
- API Key do Resend
- PostgreSQL configurado

## 🔧 Passos de Configuração

### 1️⃣ Configurar Resend

#### Criar Conta e Obter API Key

1. Acesse [https://resend.com](https://resend.com)
2. Crie uma conta ou faça login
3. No dashboard, vá em **API Keys**
4. Clique em **Create API Key**
5. Nomeie sua key (ex: "Production" ou "Development")
6. Copie a key gerada

#### Verificar Domínio (Produção)

Para usar seu próprio domínio em produção:

1. No dashboard do Resend, vá em **Domains**
2. Clique em **Add Domain**
3. Digite seu domínio (ex: `seusite.com`)
4. Configure os registros DNS conforme instruções:
   - SPF: `v=spf1 include:resend.com ~all`
   - DKIM: Adicione o registro TXT fornecido pelo Resend
   - DMARC (opcional): `v=DMARC1; p=none; rua=mailto:dmarc@seudominio.com`
5. Aguarde a verificação (pode levar alguns minutos)
6. Status mudará para "Verified" quando concluído

### 2️⃣ Configurar Variáveis de Ambiente

Copie o conteúdo de `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:

```env
# Database (já deve estar configurado)
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Better Auth (já deve estar configurado)
BETTER_AUTH_SECRET="seu-secret-aqui"
BETTER_AUTH_URL="http://localhost:3000"

# Resend - ADICIONE ESTAS CONFIGURAÇÕES
RESEND_API_KEY="re_sua_api_key_aqui"

# Para desenvolvimento, use:
EMAIL_FROM="onboarding@resend.dev"
EMAIL_FROM_NAME="Minha Aplicação"

# Para produção, após verificar domínio, use:
# EMAIL_FROM="noreply@seudominio.com"
# EMAIL_FROM_NAME="Nome da Sua Aplicação"

# Opcional - Email de reply-to
EMAIL_REPLY_TO="contato@seudominio.com"
```

### 3️⃣ Testar Configuração

#### Método 1: Através do Cadastro

1. Inicie o servidor de desenvolvimento:

   ```bash
   yarn dev
   ```

2. Acesse `http://localhost:3000/sign-up`

3. Cadastre um usuário com seu email real

4. Verifique sua caixa de entrada para o email de verificação

#### Método 2: Através da API

Crie um arquivo de teste `test-email.ts`:

```typescript
import { sendVerificationEmail } from './src/lib/email';

async function test() {
  try {
    await sendVerificationEmail('seu@email.com', 'test-token-123', 'Seu Nome');
    console.log('Email enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar:', error);
  }
}

test();
```

Execute:

```bash
npx tsx test-email.ts
```

### 4️⃣ Atualizar Schema do Prisma (Se Necessário)

O Better Auth requer que o campo `emailVerified` exista na tabela User. Verifique se já existe:

```prisma
// prisma/models/auth.prisma

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime? // <- Este campo é necessário
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  sessions      Session[]
  accounts      Account[]
}
```

Se precisar adicionar, rode:

```bash
yarn db:migrate
```

## 🧪 Testando os Fluxos

### Fluxo 1: Verificação de Email

1. Cadastre-se em `/sign-up`
2. Email de verificação é enviado automaticamente
3. Clique no link do email ou acesse `/verify-email?token=...`
4. Será verificado e redirecionado para o dashboard

### Fluxo 2: Esqueci Minha Senha

1. Acesse `/forgot-password`
2. Digite seu email
3. Email de redefinição é enviado
4. Clique no link do email ou acesse `/reset-password?token=...`
5. Digite nova senha
6. Será redirecionado para o login

### Fluxo 3: Notificação de Senha Alterada

Este fluxo precisa ser implementado manualmente quando o usuário altera a senha:

```typescript
// Em sua rota de alteração de senha
import { sendPasswordChangedEmail } from '@/src/lib/email';

// Após alterar a senha com sucesso
await sendPasswordChangedEmail(user.email, user.name || undefined);
```

## 🐛 Troubleshooting

### Erro: "RESEND_API_KEY não está configurada"

**Solução:** Verifique se:

- A variável está no arquivo `.env`
- O nome está correto: `RESEND_API_KEY`
- Não há espaços extras antes ou depois do valor
- Reiniciou o servidor após adicionar a variável

### Emails não estão chegando

**Possíveis causas:**

1. **Email está no spam**
   - Verifique sua pasta de spam/lixo eletrônico
   - Em desenvolvimento, emails do domínio `resend.dev` podem ser marcados como spam

2. **API Key inválida**
   - Verifique se copiou a key completa
   - Certifique-se de que a key não está revogada no dashboard

3. **Domínio não verificado (Produção)**
   - Em produção, você precisa verificar seu domínio
   - Use `onboarding@resend.dev` para testes

4. **Limite de envios atingido**
   - Plano gratuito: 100 emails/dia
   - Verifique seu uso no dashboard do Resend

### Erro: "Domain not verified"

**Solução:**

- Em desenvolvimento, use `EMAIL_FROM="onboarding@resend.dev"`
- Em produção, verifique seu domínio no dashboard do Resend

### Links de verificação não funcionam

**Verifique:**

- `BETTER_AUTH_URL` está configurado corretamente
- Em produção, use a URL completa: `https://seusite.com`
- Em desenvolvimento: `http://localhost:3000`

## 📊 Monitoramento

### Dashboard do Resend

Acesse [https://resend.com/emails](https://resend.com/emails) para:

- Ver todos os emails enviados
- Status de entrega
- Logs de erros
- Estatísticas de abertura (se configurado)

### Logs da Aplicação

Os logs de email aparecem no console:

```
✅ Email enviado com sucesso: { id: '...' }
❌ Erro ao enviar email: { error: '...' }
```

## 🚀 Indo para Produção

### Checklist

- [ ] Domínio verificado no Resend
- [ ] `EMAIL_FROM` usa seu domínio verificado
- [ ] `BETTER_AUTH_URL` aponta para URL de produção
- [ ] `RESEND_API_KEY` é de produção (não de teste)
- [ ] Templates de email testados e validados
- [ ] Fluxos de verificação e reset testados
- [ ] Monitoramento configurado

### Variáveis de Ambiente (Produção)

```env
# Produção
BETTER_AUTH_URL="https://seusite.com"
RESEND_API_KEY="re_sua_production_key"
EMAIL_FROM="noreply@seudominio.com"
EMAIL_FROM_NAME="Nome da Sua Aplicação"
EMAIL_REPLY_TO="suporte@seudominio.com"
```

### Otimizações

1. **Rate Limiting**: Implemente rate limiting para evitar spam
2. **Queue de Emails**: Use uma fila (BullMQ, etc.) para envios em lote
3. **Retry Logic**: Implemente retry automático para falhas temporárias
4. **Logs Estruturados**: Use um serviço de logging (DataDog, etc.)

## 📚 Recursos Adicionais

- [Documentação Completa](./src/lib/email/README.md)
- [Documentação Resend](https://resend.com/docs)
- [Documentação Better Auth](https://better-auth.com/docs)
- [Suporte Resend](https://resend.com/support)

## 💡 Dicas

1. **Desenvolvimento**: Sempre use `onboarding@resend.dev` para testes
2. **Produção**: Configure SPF, DKIM e DMARC para melhor entregabilidade
3. **Templates**: Teste em diferentes clientes de email (Gmail, Outlook, etc.)
4. **Personalização**: Customize os templates em `src/lib/email/templates.tsx`
5. **Segurança**: Nunca commite a API key no controle de versão

## 🎉 Pronto!

Seu sistema de emails está configurado e pronto para uso!

Para mais detalhes sobre uso avançado, consulte o [README completo](./src/lib/email/README.md).
