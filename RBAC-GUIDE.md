# 🔐 Sistema RBAC Multi-Tenant

## Visão Geral

Este projeto implementa um sistema completo de **RBAC (Role-Based Access Control)** para aplicações multi-tenant usando **Better Auth** e **Next.js 16**.

### ✅ O que foi implementado

- ✅ Sistema de permissões RBAC com 3 roles (Owner, Admin, Member)
- ✅ Multi-tenancy com Organizations
- ✅ Sign-up cria Organization automaticamente
- ✅ Sign-in com seleção de Organization
- ✅ Hooks para gerenciar permissões client-side
- ✅ Componentes React para UI condicional
- ✅ Utilitários para proteção de API Routes

---

## 📁 Estrutura de Arquivos

```
src/
├── lib/
│   ├── permissions.ts          # Sistema de permissões RBAC
│   ├── auth-helpers.ts         # Helpers server-side para API routes
│   ├── auth.ts                 # Configuração Better Auth (já tinha)
│   └── auth-client.ts          # Cliente Better Auth (já tinha)
│
├── hooks/
│   ├── use-active-organization.ts  # Hook para organization ativa
│   └── use-permissions.ts          # Hook para verificar permissões
│
├── components/
│   └── can.tsx                 # Componentes de UI condicional
│
├── app/
│   ├── (auth)/
│   │   ├── sign-up/page.tsx   # Cadastro + criação de organization
│   │   └── sign-in/page.tsx   # Login + seleção de organization
│   │
│   └── api/
│       └── members/
│           └── invite/route.ts # Exemplo de API protegida

prisma/
└── models/
    ├── auth.prisma            # Models de autenticação
    └── organization.prisma     # Models de organization (já tinha)
```

---

## 🎯 Roles e Hierarquia

### Roles Disponíveis

| Role       | Nível | Descrição                                        |
| ---------- | ----- | ------------------------------------------------ |
| **Owner**  | 3     | Proprietário - controle total da organization    |
| **Admin**  | 2     | Administrador - gerencia membros e configurações |
| **Member** | 1     | Membro - acesso básico aos recursos              |

### Hierarquia

```
Owner (nível 3)
  ├── Pode tudo que Admin pode
  └── + Faturamento, deletar organization

Admin (nível 2)
  ├── Pode tudo que Member pode
  └── + Convidar/remover membros, configurações avançadas

Member (nível 1)
  └── Acesso básico (ler, criar conteúdo)
```

---

## 🔑 Permissões Disponíveis

```typescript
// Gestão de Organização
'organization:read';
'organization:update'; // ⚠️ Apenas Owner
'organization:delete'; // ⚠️ Apenas Owner

// Gestão de Membros
'members:read';
'members:invite'; // Owner, Admin
'members:remove'; // Owner, Admin
'members:update-role'; // ⚠️ Apenas Owner

// Convites
'invitations:create'; // Owner, Admin
'invitations:cancel'; // Owner, Admin
'invitations:resend'; // Owner, Admin

// Configurações
'settings:view';
'settings:update'; // Owner, Admin
'settings:advanced'; // ⚠️ Apenas Owner

// Faturamento
'billing:view'; // ⚠️ Apenas Owner
'billing:manage'; // ⚠️ Apenas Owner

// Relatórios
'reports:view'; // Owner, Admin
'reports:export'; // ⚠️ Apenas Owner

// Conteúdo (exemplo - ajuste conforme sua aplicação)
'content:create';
'content:read';
'content:update';
'content:delete'; // Owner, Admin

// Integrações
'integrations:view'; // Owner, Admin
'integrations:manage'; // Owner, Admin
```

---

## 🚀 Como Usar

### 1️⃣ Client-Side: Componentes React

#### Componente `<Can>`

Renderiza conteúdo baseado em permissão específica:

```tsx
import { Can } from '@/src/components/can';
import { Button } from '@/src/components/ui/button';

function MyComponent() {
  return (
    <Can permission="members:invite">
      <Button>Convidar Membro</Button>
    </Can>
  );
}
```

#### Componente `<HasRole>`

Renderiza conteúdo baseado em role específico:

```tsx
import { HasRole } from '@/src/components/can';

function MyComponent() {
  return (
    <HasRole role="owner">
      <DangerZone />
    </HasRole>
  );
}
```

#### Componente `<HasMinRole>`

Renderiza conteúdo baseado em nível mínimo de role:

```tsx
import { HasMinRole } from '@/src/components/can';

function MyComponent() {
  return (
    // Exibe para Admin e Owner (não para Member)
    <HasMinRole minRole="admin">
      <AdvancedSettings />
    </HasMinRole>
  );
}
```

#### Componente com Fallback

```tsx
<Can
  permission="billing:view"
  fallback={<div>Apenas proprietários podem ver faturamento</div>}
>
  <BillingPanel />
</Can>
```

---

### 2️⃣ Client-Side: Hook `usePermissions`

```tsx
'use client';

import { usePermissions } from '@/src/hooks/use-permissions';

function MyComponent() {
  const { can, isOwner, isAdmin, role, roleLabel } = usePermissions();

  // Verificar permissão específica
  if (can('members:invite')) {
    return <Button>Convidar</Button>;
  }

  // Verificar role
  if (isOwner) {
    return <DangerZone />;
  }

  // Exibir role do usuário
  return <div>Você é: {roleLabel}</div>;
}
```

#### Métodos Disponíveis

```typescript
const {
  can, // (permission: Permission) => boolean
  canAny, // (permissions: Permission[]) => boolean
  canAll, // (permissions: Permission[]) => boolean
  hasLevel, // (requiredRole: Role) => boolean
  isOwner, // boolean
  isAdmin, // boolean (admin OU owner)
  isMember, // boolean
  role, // 'owner' | 'admin' | 'member' | null
  roleLabel, // 'Proprietário' | 'Administrador' | 'Membro'
  roleDescription, // string
  permissions, // Permission[] (todas as permissões do usuário)
  loading, // boolean
} = usePermissions();
```

---

### 3️⃣ Client-Side: Hook `useActiveOrganization`

```tsx
'use client';

import { useActiveOrganization } from '@/src/hooks/use-active-organization';

function MyComponent() {
  const { organization, loading, refetch } = useActiveOrganization();

  if (loading) return <Spinner />;
  if (!organization) return <div>Nenhuma empresa selecionada</div>;

  return (
    <div>
      <h1>{organization.name}</h1>
      <p>Seu papel: {organization.role}</p>
    </div>
  );
}
```

---

### 4️⃣ Server-Side: Proteção de API Routes

#### Exemplo: Verificar Permissão

```typescript
// src/app/api/members/invite/route.ts
import { requirePermission } from '@/src/lib/auth-helpers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Verifica se tem permissão
  const authResult = await requirePermission('members:invite');

  if (!authResult.authorized) {
    return authResult.response; // Retorna 401 ou 403
  }

  // authResult contém:
  // - session: Sessão do usuário
  // - member: Dados do member na organization
  // - organization: Dados da organization

  // Continue com a lógica...
  return NextResponse.json({ success: true });
}
```

#### Exemplo: Verificar Role

```typescript
import { requireRole } from '@/src/lib/auth-helpers';

export async function DELETE(request: NextRequest) {
  // Apenas owners podem deletar
  const authResult = await requireRole('owner');

  if (!authResult.authorized) {
    return authResult.response;
  }

  // Lógica de deleção...
}
```

#### Exemplo: Apenas Autenticação

```typescript
import { requireAuth } from '@/src/lib/auth-helpers';

export async function GET() {
  // Verifica apenas se está autenticado
  const authResult = await requireAuth();

  if (!authResult.authorized) {
    return authResult.response;
  }

  const { session } = authResult;
  // Continue...
}
```

---

### 5️⃣ Server-Side: Proteção de Páginas

```tsx
// página protegida (Server Component)
import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import prisma from '@/src/lib/prisma';

export default async function ProtectedPage() {
  // 1. Verifica autenticação
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  // 2. Verifica organization ativa
  const activeOrgId = session.session.activeOrganizationId;

  if (!activeOrgId) {
    redirect('/select-organization');
  }

  // 3. Busca member e verifica role
  const member = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: activeOrgId,
    },
  });

  if (!member || member.role !== 'owner') {
    redirect('/unauthorized');
  }

  // Continue...
  return <div>Página protegida</div>;
}
```

---

## 📝 Exemplos Práticos

### Página de Configurações com RBAC

Veja o exemplo completo em:

- `src/app/[slug]/(dashboard)/settings-example/page.tsx`

### API Route Protegida

Veja o exemplo completo em:

- `src/app/api/members/invite/route.ts`

---

## 🔄 Fluxo de Autenticação

```
┌─────────────┐
│  Sign-Up    │
└──────┬──────┘
       │ 1. Cria User
       │ 2. Faz Login
       │ 3. Cria Organization
       │ 4. Cria Member (role: owner)
       │ 5. Set Active Organization
       ▼
┌─────────────┐
│   Sign-In   │
└──────┬──────┘
       │ 1. Valida credenciais
       │ 2. Busca organizations do usuário
       ▼
   ┌───┴────────────────────────┐
   │  Quantas Organizations?    │
   └────┬──────────────────┬────┘
        │                  │
   [1 org]            [2+ orgs]
        │                  │
        ▼                  ▼
  Auto-select      Mostra Combobox
        │                  │
        └────────┬─────────┘
                 │ 3. Set Active Organization
                 ▼
         ┌───────────────┐
         │   Dashboard   │
         └───────────────┘
```

---

## 🛠️ Personalizando Permissões

Para adicionar novas permissões, edite `src/lib/permissions.ts`:

```typescript
export const PERMISSIONS = {
  // ... permissões existentes

  // Adicione suas permissões customizadas
  'invoices:create': ['owner', 'admin', 'member'],
  'invoices:approve': ['owner', 'admin'],
  'invoices:pay': ['owner'],
} as const;
```

---

## 🎨 Adicionando Roles Customizados

Se precisar de roles além de owner/admin/member, você pode:

1. Criar um model `CustomRole` no Prisma
2. Estender o sistema para aceitar roles customizados por organization
3. Mapear permissões dinamicamente

Exemplo:

```typescript
// Futuro: Support para custom roles
interface CustomRole {
  id: string;
  name: string;
  organizationId: string;
  permissions: Permission[];
}
```

---

## ⚠️ Boas Práticas

1. **Sempre verifique permissões server-side** antes de executar ações críticas
2. **Use componentes client-side apenas para UX** (esconder botões, seções)
3. **Nunca confie apenas em verificações client-side** - elas podem ser bypassadas
4. **Teste permissões com diferentes roles** em cada feature
5. **Documente permissões customizadas** que adicionar
6. **Use `requirePermission` em todas as API routes** que modificam dados

---

## 🧪 Testando

### Testar diferentes roles:

1. Crie 3 contas de teste:
   - `owner@test.com` (será owner ao criar organization)
   - `admin@test.com` (convide como admin)
   - `member@test.com` (convide como member)

2. Acesse a página de exemplo:
   - `/settings-example`
   - Veja como a UI muda baseada no role

3. Teste API routes:
   ```bash
   curl -X POST http://localhost:3000/api/members/invite \
     -H "Content-Type: application/json" \
     -d '{"email": "teste@example.com", "role": "member"}'
   ```

---

## 📚 Recursos

- [Documentação Better Auth](https://www.better-auth.com/docs)
- [Better Auth Organizations Plugin](https://www.better-auth.com/docs/plugins/organization)
- [RBAC Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

---

## 🐛 Troubleshooting

### Erro: "Nenhuma organização ativa"

**Causa**: Usuário logado mas não selecionou organization

**Solução**: Redirecione para sign-in ou implemente page de seleção

### Erro: "Permissão negada" em API

**Causa**: Role do usuário não tem a permissão necessária

**Solução**: Verifique `PERMISSIONS` em `permissions.ts` e ajuste

### Organization não aparece na seleção

**Causa**: Usuário não é member da organization

**Solução**: Verifique tabela `member` no banco de dados

---

## 🎯 Próximos Passos

- [ ] Implementar página de gerenciamento de membros
- [ ] Implementar sistema de convites por email
- [ ] Criar switcher de organization no header
- [ ] Adicionar logs de auditoria (quem fez o quê)
- [ ] Implementar soft-delete de organizations
- [ ] Criar testes automatizados de permissões

---

**Implementado com ❤️ usando Next.js 16 + Better Auth + Prisma + RBAC**
