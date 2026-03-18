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
│   ├── forms/              # Componentes de formulário personalizados
│   └── ui/                 # Componentes shadcn/ui (não modificar diretamente)
├── context/                # Contexts e Providers globais
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

### Hooks do Next.js

**IMPORTANTE: `useSearchParams()` requer Suspense boundary**

Quando usar `useSearchParams()` em uma página, você DEVE envolver o componente em um `Suspense` para evitar erros de build:

```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Componente interno que usa useSearchParams
function MyPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return <div>{token}</div>;
}

// Componente principal exportado com Suspense
export default function MyPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <MyPageContent />
    </Suspense>
  );
}
```

**Hooks que NÃO precisam de Suspense:**

- ✅ `useRouter()` - Navegação programática
- ✅ `usePathname()` - Caminho atual da URL
- ✅ `useParams()` - Parâmetros de rota dinâmica

**Hooks que PRECISAM de Suspense:**

- ⚠️ `useSearchParams()` - Query parameters da URL (?param=value)

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

// Importe contexts sempre de @/src/context
import { MyProvider } from '@/src/context/my-provider';
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

// Solicitar redefinição de senha
await authClient.requestPasswordReset({ email, redirectTo: '/reset-password' });

// Redefinir senha com token
await authClient.resetPassword({ newPassword, token });

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

### Ao Criar Contexts e Providers

**OBRIGATÓRIO: Siga esta estrutura para contexts:**

1. **Localização**: Todos os contexts devem ser criados em `src/context/`
2. **Nomenclatura**: Use kebab-case para arquivos (ex: `auth-context.tsx`, `theme-provider.tsx`)
3. **Importação**: Sempre use o alias `@/src/context/` para importar
4. **Estrutura do arquivo**:

```typescript
'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

// 1. Defina o tipo do contexto
interface MyContextType {
  value: string;
  setValue: (value: string) => void;
}

// 2. Crie o contexto com valor padrão
const MyContext = createContext<MyContextType | undefined>(undefined);

// 3. Crie o Provider
export function MyProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<string>('');

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
}

// 4. Crie o hook customizado
export function useMyContext() {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext deve ser usado dentro de MyProvider');
  }
  return context;
}
```

**Uso do Provider:**

```typescript
// app/layout.tsx ou onde necessário
import { MyProvider } from '@/src/context/my-provider';

export default function Layout({ children }) {
  return (
    <MyProvider>
      {children}
    </MyProvider>
  );
}
```

**Uso do hook:**

```typescript
'use client';
import { useMyContext } from '@/src/context/my-provider';

export function MyComponent() {
  const { value, setValue } = useMyContext();
  // ...
}
```

### Ao Criar Formulários

**OBRIGATÓRIO: Todos os formulários devem seguir este padrão:**

1. **Usar React Hook Form com FormProvider**:
   - Importe `useForm` e `FormProvider` de `react-hook-form`
   - Configure o form com `zodResolver` para validação
   - Envolva o formulário com `<FormProvider {...form}>`

2. **Controlar estado de loading**:
   - Use `useState` para controlar loading (`const [loading, setLoading] = useState(false)`)
   - Desabilite o botão de submit durante loading (`disabled={loading}`)
   - Mostre feedback visual (spinner, texto "Carregando...")

3. **Usar componentes da pasta `components/forms`**:
   - `InputFormField` - Campos de texto
   - `PasswordFormField` - Campos de senha com toggle de visibilidade
   - `CheckboxFormField` - Checkboxes
   - `RadioGroupFormField` - Grupos de radio buttons
   - `ComboboxFormField` - Comboboxes/Selects com busca
   - `DatePickerFormField` - Seletor de data
   - `MaskFormField` - Campos com máscara (CPF, telefone, etc.)

4. **Validações com Zod**:
   - Defina um `formSchema` usando `z.object()` do Zod
   - Use mensagens de erro em português
   - Use `z.infer<typeof formSchema>` para tipar os dados do formulário

**Exemplo de implementação completa:**

```typescript
'use client';

import { InputFormField, PasswordFormField } from '@/src/components/forms';
import { Button } from '@/src/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
});

export function MyForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      // Lógica de submissão
      await api.submit(data);
      toast.success('Dados enviados com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar dados');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <InputFormField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          disabled={loading}
          required
        />
        <PasswordFormField
          control={form.control}
          name="password"
          label="Senha"
          placeholder="••••••••"
          disabled={loading}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </Button>
      </form>
    </FormProvider>
  );
}
```

**NÃO FAÇA:**

- ❌ Usar componentes `Field`, `FieldLabel`, `FieldError`, `Input` diretamente
- ❌ Usar `form.register()` manualmente
- ❌ Criar formulários sem validação Zod
- ❌ Usar validação inline sem schema
- ❌ Não controlar estado de loading
- ❌ Não desabilitar botões durante submissão
- ❌ Não usar toast para feedback

5. **Exibir mensagens com Toast**:
   - **SEMPRE** use `toast` do `sonner` para exibir mensagens de feedback ao usuário
   - Importe com `import { toast } from 'sonner'`
   - Use `toast.success()` para mensagens de sucesso
   - Use `toast.error()` para mensagens de erro
   - Use `toast.info()` para mensagens informativas
   - **NÃO** use componentes `Alert` ou estados visuais para erros de formulário
   - Mantenha as mensagens curtas e diretas em português

**Exemplo de uso do toast:**

```typescript
'use client';

import { toast } from 'sonner';

// Sucesso
toast.success('Operação realizada com sucesso!');

// Erro
toast.error('Erro ao processar sua solicitação');

// Informação
toast.info('Verifique seu email');

// Em formulários
async function onSubmit(data: FormData) {
  try {
    await api.submit(data);
    toast.success('Dados salvos com sucesso!');
  } catch (error) {
    toast.error('Erro ao salvar dados');
  }
}
```

### Ao Trabalhar com Autenticação

1. **Server Components**: Use `auth.api.getSession()` com headers
2. **Client Components**: Use o hook `authClient.useSession()`
3. **Rotas de API**: Acesse a sessão via `auth.api.getSession({ headers })`
4. **Rotas protegidas**: Verifique a sessão e redirecione se não autenticado
5. **Acesso baseado em roles**: Estenda o model User com roles se necessário

### Ao Criar Páginas (Telas)

**OBRIGATÓRIO: Siga este padrão para páginas:**

1. **Estrutura de pastas**: Use as convenções do App Router
   - Páginas públicas: `app/(public)/minha-pagina/page.tsx`
   - Páginas autenticadas: `app/(auth)/perfil/page.tsx`
   - Páginas do dashboard: `app/[userId]/(dashboard)/config/page.tsx`

2. **Estrutura do arquivo de página**:

```typescript
'use client'; // Se necessário interatividade

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Página: Nome da Página
 * Descrição: O que esta página faz
 *
 * Rota: /caminho-da-rota
 */
export default function MinhaPage() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lógica de inicialização
  }, []);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Título da Página</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Conteúdo da página */}
        </CardContent>
      </Card>
    </div>
  );
}
```

3. **Páginas protegidas (Server Component)**:

```typescript
import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function ProtectedPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div>
      <h1>Olá, {session.user.name}</h1>
    </div>
  );
}
```

4. **Convenções de layout**:
   - Use componentes `Card` do shadcn/ui para containers
   - Mantenha espaçamento consistente (`py-8`, `px-4`, `gap-6`)
   - Use `container mx-auto` para centralizar conteúdo
   - Adicione comentários descritivos no topo do arquivo

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
  toast.error('Erro ao fazer login');
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
