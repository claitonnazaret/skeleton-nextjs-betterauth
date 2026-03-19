# Componentes do Dashboard

Componentes criados para o layout do dashboard, seguindo o modelo sidebar-07 do shadcn/ui com personalizações.

## Estrutura

```
src/components/dashboard/
├── app-sidebar.tsx       # Sidebar principal do dashboard
├── dashboard-header.tsx  # Header fixo com título e breadcrumbs
├── auto-breadcrumbs.tsx  # Breadcrumbs automático baseado na rota
└── index.ts              # Exports centralizados
```

## Componentes

### AppSidebar

Sidebar principal do dashboard com:

- **Header fixo**: Logo e nome da organização
- **Menu com scroll próprio**: Apenas a área de conteúdo do menu tem scroll
- **Footer fixo**: Menu dropdown do usuário com avatar
- **Responsivo**: Mobile-first com overlay em dispositivos móveis
- **Modo collapse**: Suporta modo icon-only no desktop

**Props:**

- `organizationSlug`: Slug da organização para navegação
- `organizationName`: Nome da organização para exibição

**Uso:**

```tsx
<AppSidebar organizationSlug="minha-org" organizationName="Minha Organização" />
```

### DashboardHeader

Header fixo do dashboard com:

- **Título em evidência**: Nome da organização à esquerda
- **Breadcrumbs automático**: Abaixo do título, lê as rotas automaticamente
- **Botões de ação à direita**:
  - Botão de notificações (sino)
  - Botão de troca de tema (sol/lua)
- **SidebarTrigger**: Botão para abrir/fechar sidebar em mobile

**Props:**

- `title`: Título principal do header (geralmente nome da organização)

**Uso:**

```tsx
<DashboardHeader title="Minha Organização" />
```

### AutoBreadcrumbs

Breadcrumbs automático que:

- **Lê a rota atual**: Usa `usePathname()` do Next.js
- **Remove o slug da organização**: Primeiro segmento é ignorado
- **Formata automaticamente**: Converte `settings-example` → `Settings Example`
- **Links clicáveis**: Todos os segmentos exceto o último são links
- **Sempre mostra Dashboard**: Link para a home da organização

**Exemplo de rotas:**

- `/minha-org` → `Dashboard`
- `/minha-org/projects` → `Dashboard > Projects`
- `/minha-org/settings/team` → `Dashboard > Settings > Team`

**Uso:**

```tsx
<AutoBreadcrumbs />
```

## Layout do Dashboard

O layout do dashboard está em `src/app/[slug]/(dashboard)/layout.tsx` e segue esta estrutura:

```tsx
<SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    <DashboardHeader />
    <div className="overflow-y-auto overflow-x-hidden">{children}</div>
  </SidebarInset>
</SidebarProvider>
```

### Características do Layout

1. **Sidebar ocupa toda lateral esquerda**: Altura 100vh
2. **Header fixo no topo**: Sticky, respeita o collapse do sidebar
3. **Menu com scroll próprio**: Header e footer do sidebar são fixos
4. **Body com scroll vertical**: Sem scroll horizontal
5. **Responsivo**: Mobile-first com drawer em dispositivos móveis

## Páginas de Exemplo

Páginas criadas para demonstrar o layout:

- **Dashboard** (`/[slug]`): Página inicial com estatísticas
- **Projetos** (`/[slug]/projects`): Lista de projetos
- **Equipe** (`/[slug]/team`): Gerenciamento de membros
- **Configurações** (`/[slug]/settings`): Configurações da organização

## Temas

O botão de troca de tema usa o `next-themes` configurado no `ThemeProvider`:

- **Sistema**: Segue as preferências do sistema operacional
- **Light**: Tema claro
- **Dark**: Tema escuro

O provider está configurado em `src/context/theme-provider.tsx` e aplicado no layout raiz.

## Customização

### Alterar itens do menu

Edite o array `menuItems` em `app-sidebar.tsx`:

```tsx
const menuItems = [
  {
    title: 'Dashboard',
    url: `/${organizationSlug}`,
    icon: HomeIcon,
  },
  // Adicione mais itens aqui
];
```

### Alterar formatação do breadcrumbs

Edite a função `formatSegmentName` em `auto-breadcrumbs.tsx`:

```tsx
const formatSegmentName = (segment: string) => {
  // Sua lógica de formatação customizada
  return segment.toUpperCase();
};
```

### Alterar altura do header

Edite a classe `h-16` em `dashboard-header.tsx`:

```tsx
<header className="sticky top-0 z-10 flex flex-col border-b bg-background">
  <div className="flex h-16 items-center gap-2 px-4">{/* ... */}</div>
</header>
```

## Dependências

- `next-themes`: Gerenciamento de temas
- `lucide-react`: Ícones
- `radix-ui`: Primitivos dos componentes
- `tailwindcss`: Estilização

## Observações

- Todos os componentes usam `'use client'` pois dependem de hooks do React/Next.js
- O layout principal é um Server Component para buscar dados da organização
- O breadcrumbs funciona automaticamente sem configuração adicional
- O sidebar suporta keyboard shortcut `Ctrl/Cmd + B` para toggle
