# Instruções do GitHub Copilot - Projeto Next.js + Better Auth

## ⚠️ IMPORTANTE: Idioma

**TODAS as respostas, sugestões de código, comentários e explicações devem ser fornecidas em PORTUGUÊS DO BRASIL.**

Ao gerar código:

- Variáveis e funções devem usar inglês (padrão da indústria)
- Comentários devem estar em português do Brasil
- Mensagens ao usuário devem estar em português do Brasil
- Explicações e documentação devem estar em português do Brasil

## Visão Geral do Projeto

Este é um projeto skeleton Next.js 16 com autenticação Better Auth, Prisma ORM, banco de dados PostgreSQL e componentes shadcn/ui com o estilo Radix Nova.

## Stack Tecnológica

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 19.2.3 com React Compiler habilitado
- **TypeScript**: 5.x com modo strict
- **Autenticação**: Better Auth com email/senha
- **Banco de Dados**: PostgreSQL com Prisma ORM 7.5.0
- **Estilização**: Tailwind CSS 4 com shadcn/ui (estilo Radix Nova)
- **Componentes UI**: shadcn/ui baseado em primitivos Radix UI
- **Gerenciador de Pacotes**: Yarn 4.13.0
- **Testes**: Ainda não configurado

## Estrutura do Projeto

### Organização de Diretórios

```
src/
├── app/                    # Páginas e layouts do Next.js App Router
│   ├── api/auth/[...all]/  # Rotas da API do Better Auth
│   ├── layout.tsx          # Layout raiz com fontes
│   ├── page.tsx            # Página inicial
│   └── globals.css         # Estilos globais com Tailwind
├── components/
│   └── ui/                 # Componentes shadcn/ui (não modificar diretamente)
├── hooks/                  # Hooks customizados do React
└── lib/                    # Utilitários e configurações
    ├── auth.ts             # Configuração do Better Auth no servidor
    ├── auth-client.ts      # Configuração do Better Auth no cliente
    ├── prisma.ts           # Instância do cliente Prisma
    └── utils.ts            # Funções utilitárias (cn, etc.)

prisma/
├── schema.prisma           # Schema principal do Prisma
├── models/                 # Definições de models do Prisma
│   └── auth.prisma         # Models de autenticação (User, Session, Account, Verification)
└── generated/              # Cliente Prisma gerado (caminho de output customizado)
```

## Convenções de Código

### TypeScript

- **Modo strict habilitado**: Todo código deve satisfazer as verificações strict do TypeScript
- **Target**: ES2023
- **Aliases de caminho**:
  - `@/src/*` → `./src/*`
  - `@/prisma-generated/*` → `./prisma/generated/*`
- Use tipos apropriados para todos os parâmetros de função e valores de retorno
- Evite o tipo `any` a menos que seja absolutamente necessário
- Use `type` para formas de objetos, `interface` para contratos extensíveis

### React & Next.js

- **Server Components por padrão**: Use a diretiva `"use client"` apenas quando necessário
- **React Server Components (RSC)**: Prefira server components para busca de dados
- **React Compiler**: Habilitado - evite memoização manual (useMemo, useCallback) a menos que necessário
- Use as convenções do App Router (não Pages Router)
- Nomenclatura de arquivos: minúsculas com hifens (ex: `user-profile.tsx`)
- Nomenclatura de componentes: PascalCase (ex: `UserProfile`)

### Estilização

- **Tailwind CSS 4**: Use classes utilitárias do Tailwind
- **Helper cn()**: Sempre use a função `cn()` de `@/src/lib/utils` para classes condicionais
- **Componentes shadcn/ui**: Importe de `@/src/components/ui/*`
- **Variáveis CSS**: Habilitadas para tematização
- **Suporte RTL**: Habilitado
- **Cor base**: Zinc
- **Fontes**:
  - Primária: Roboto (--font-sans)
  - Secundária: Geist Sans (--font-geist-sans)
  - Mono: Geist Mono (--font-geist-mono)

### Importações de Componentes

```typescript
// Prefira importações nomeadas
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';

// Use aliases de caminho consistentemente
import { cn } from '@/src/lib/utils';
import { authClient } from '@/src/lib/auth-client';
```

## Configuração do Better Auth

### Autenticação Server-Side

- **Arquivo**: `src/lib/auth.ts`
- **Banco de Dados**: Usa adaptador Prisma com PostgreSQL
- **Base URL**: Configurada via `BETTER_AUTH_URL` (padrão: `http://localhost:3000`)
- **Secret**: Configurado via `BETTER_AUTH_SECRET`
- **Recursos habilitados**: Autenticação com email e senha

```typescript
// Uso de autenticação no servidor
import { auth } from '@/src/lib/auth';

// Em server components ou rotas de API
const session = await auth.api.getSession({ headers: request.headers });
```

### Autenticação Client-Side

- **Arquivo**: `src/lib/auth-client.ts`
- **Baseado em hooks**: Use hooks do React para operações de autenticação

```typescript
// Uso de autenticação em componente cliente
'use client';
import { authClient } from '@/src/lib/auth-client';

// Login
await authClient.signIn.email({ email, password });

// Cadastro
await authClient.signUp.email({ email, password, name });

// Logout
await authClient.signOut();

// Obter sessão
const { data: session } = authClient.useSession();
```

### Rota da API de Autenticação

- **Caminho**: `src/app/api/auth/[...all]/route.ts`
- Lida com todas as operações do Better Auth (login, cadastro, logout, etc.)
- Não modifique a menos que esteja adicionando recursos customizados de autenticação

## Banco de Dados Prisma

### Organização do Schema

- **Schema principal**: `prisma/schema.prisma`
- **Arquivos de models**: `prisma/models/*.prisma` (organização modular)
- **Cliente gerado**: `prisma/generated/prisma/` (caminho de output customizado)
- **Banco de Dados**: PostgreSQL via `@prisma/adapter-pg`

### Uso do Cliente Prisma

```typescript
// Sempre importe do caminho gerado
import { PrismaClient } from '@prisma/client';
import { prisma } from '@/src/lib/prisma';

// Use a instância singleton
const users = await prisma.user.findMany();
```

### Scripts Disponíveis

- `yarn db:generate` - Gerar cliente Prisma
- `yarn db:migrate` - Executar migrations
- `yarn db:push` - Enviar schema para o banco de dados (sem migrations)
- `yarn db:studio` - Abrir Prisma Studio
- `yarn db:reset` - Resetar banco de dados (aviso: deleta todos os dados)
- `yarn db:seed` - Popular banco de dados

### Models do Schema de Autenticação

- **User**: Dados principais do usuário (id, name, email, emailVerified, image)
- **Session**: Sessões de usuário com expiração e metadata
- **Account**: Contas OAuth e armazenamento de senha
- **Verification**: Tokens de verificação de email

## Variáveis de Ambiente

Variáveis de ambiente obrigatórias (configuradas no `.env`):

```env
BETTER_AUTH_SECRET=<secret-auto-gerado>
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

## Fluxo de Desenvolvimento

### Comandos

- `yarn dev` - Iniciar servidor de desenvolvimento (porta 3000)
- `yarn build` - Build para produção
- `yarn start` - Iniciar servidor de produção
- `yarn lint` - Executar ESLint
- `yarn lint:fix` - Corrigir problemas do ESLint
- `yarn format` - Formatar código com Prettier
- `yarn format:check` - Verificar formatação do código

### Git Hooks

- **Pre-commit**: Executa lint-staged (ESLint + Prettier em arquivos staged)
- **Mensagens de commit**: Validadas por git-commit-msg-linter

## Melhores Práticas

### Ao Criar Novos Recursos

1. **Autenticação necessária?** Use o gerenciamento de sessão integrado do Better Auth
2. **Queries no banco?** Use o cliente Prisma com tratamento adequado de erros
3. **Formulários?** Considere usar React Hook Form ou formulários nativos com server actions
4. **Componentes UI?** Verifique se o shadcn/ui tem o componente antes de criar customizado
5. **Interatividade no cliente?** Marque o componente com a diretiva `"use client"`

### Ao Adicionar Models no Banco de Dados

1. Adicione o model em `prisma/schema.prisma` ou crie em `prisma/models/`
2. Execute `yarn db:generate` para gerar os tipos
3. Execute `yarn db:migrate` para criar a migration
4. Importe os tipos de `@prisma/client`

### Ao Adicionar Componentes UI

1. Use `npx shadcn@latest add <component>` para adicionar novos componentes shadcn
2. Não edite manualmente arquivos em `src/components/ui/` (são auto-gerados)
3. Componha componentes shadcn em `src/components/` para componentes customizados

### Ao Trabalhar com Autenticação

1. **Server Components**: Use `auth.api.getSession()` com headers
2. **Client Components**: Use o hook `authClient.useSession()`
3. **Rotas de API**: Acesse a sessão via `auth.api.getSession({ headers })`
4. **Rotas protegidas**: Verifique a sessão e redirecione se não autenticado
5. **Acesso baseado em roles**: Estenda o model User com roles se necessário

### Tratamento de Erros

```typescript
// Server components
try {
  const data = await prisma.user.findUnique({ where: { id } });
  if (!data) notFound();
  return data;
} catch (error) {
  console.error('Erro no banco de dados:', error);
  throw error;
}

// Client components
try {
  await authClient.signIn.email({ email, password });
} catch (error) {
  // Trate erros de autenticação
  console.error('Erro ao fazer login:', error);
}
```

## Qualidade de Código

- **Prettier**: Formatação de código forçada
- **ESLint**: Configuração Next.js + Prettier
- **TypeScript**: Modo strict sem any implícito
- **Lint-staged**: Hooks pre-commit para verificações de qualidade

## Padrões Comuns

### Criando uma Página Protegida

```typescript
// app/dashboard/page.tsx
import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect('/login');
  }

  return <div>Bem-vindo, {session.user.name}</div>;
}
```

### Criando um Formulário de Autenticação Cliente

```typescript
"use client";
import { authClient } from '@/src/lib/auth-client';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';

export function SignInForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await authClient.signIn.email({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input name="email" type="email" required />
      <Input name="password" type="password" required />
      <Button type="submit">Entrar</Button>
    </form>
  );
}
```

## Notas Adicionais

- Este é um projeto skeleton/starter - estenda conforme necessário
- Better Auth suporta muitos mais recursos (OAuth, 2FA, etc.) - consulte a documentação do Better Auth
- O schema do Prisma pode ser estendido com models e relacionamentos adicionais
- Considere adicionar configuração de testes (Jest, Playwright) para projetos em produção
- Considere adicionar logging (Pino, Winston) para produção
- Considere adicionar rastreamento de erros (Sentry) para produção

## Recursos

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Better Auth](https://www.better-auth.com/docs)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Documentação shadcn/ui](https://ui.shadcn.com)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
