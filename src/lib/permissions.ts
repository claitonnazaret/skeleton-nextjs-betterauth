/**
 * Sistema RBAC (Role-Based Access Control)
 * Define roles, hierarquia e permissões para o sistema multi-tenant
 */

export const ROLES = {
  OWNER: 'owner', // Criador do tenant - controle total
  ADMIN: 'admin', // Gerente - pode adicionar/remover membros
  MEMBER: 'member', // Usuário comum - acesso básico
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Hierarquia de roles (usado para comparações de nível)
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  owner: 3, // Maior privilégio
  admin: 2,
  member: 1, // Menor privilégio
};

/**
 * Labels em português para exibição na UI
 */
export const ROLE_LABELS: Record<Role, string> = {
  owner: 'Proprietário',
  admin: 'Administrador',
  member: 'Membro',
};

/**
 * Descrições dos roles
 */
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: 'Controle total da organização, incluindo faturamento e exclusão',
  admin: 'Pode gerenciar membros e configurações avançadas',
  member: 'Acesso básico aos recursos da organização',
};

/**
 * Mapa de permissões por role
 * Define quais roles têm acesso a cada operação
 */
export const PERMISSIONS = {
  // ========== Gestão de Organização ==========
  'organization:read': ['owner', 'admin', 'member'],
  'organization:update': ['owner'],
  'organization:delete': ['owner'],

  // ========== Gestão de Membros ==========
  'members:read': ['owner', 'admin', 'member'],
  'members:invite': ['owner', 'admin'],
  'members:remove': ['owner', 'admin'],
  'members:update-role': ['owner'], // Apenas owner pode alterar roles

  // ========== Gestão de Convites ==========
  'invitations:create': ['owner', 'admin'],
  'invitations:cancel': ['owner', 'admin'],
  'invitations:resend': ['owner', 'admin'],

  // ========== Configurações ==========
  'settings:view': ['owner', 'admin', 'member'],
  'settings:update': ['owner', 'admin'],
  'settings:advanced': ['owner'],

  // ========== Faturamento ==========
  'billing:view': ['owner'],
  'billing:manage': ['owner'],

  // ========== Relatórios e Analytics ==========
  'reports:view': ['owner', 'admin'],
  'reports:export': ['owner'],

  // ========== Conteúdo (exemplo - ajuste conforme sua aplicação) ==========
  'content:create': ['owner', 'admin', 'member'],
  'content:read': ['owner', 'admin', 'member'],
  'content:update': ['owner', 'admin', 'member'],
  'content:delete': ['owner', 'admin'],

  // ========== Integrações ==========
  'integrations:view': ['owner', 'admin'],
  'integrations:manage': ['owner', 'admin'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Verifica se um role tem uma permissão específica
 *
 * @param userRole - Role do usuário
 * @param permission - Permissão a ser verificada
 * @returns true se o role tem a permissão
 *
 * @example
 * hasPermission('admin', 'members:invite') // true
 * hasPermission('member', 'billing:view') // false
 */
export function hasPermission(userRole: Role, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return (allowedRoles as readonly string[]).includes(userRole);
}

/**
 * Verifica se um role é maior ou igual a outro na hierarquia
 *
 * @param userRole - Role do usuário
 * @param requiredRole - Role mínimo requerido
 * @returns true se o userRole tem nível suficiente
 *
 * @example
 * hasRoleLevel('owner', 'admin') // true (owner >= admin)
 * hasRoleLevel('member', 'admin') // false (member < admin)
 */
export function hasRoleLevel(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Lista todas as permissões que um role possui
 *
 * @param userRole - Role do usuário
 * @returns Array de permissões
 */
export function getRolePermissions(userRole: Role): Permission[] {
  return Object.entries(PERMISSIONS)
    .filter(([, roles]) => (roles as readonly string[]).includes(userRole))
    .map(([permission]) => permission as Permission);
}

/**
 * Valida se um role é válido
 */
export function isValidRole(role: string): role is Role {
  return Object.values(ROLES).includes(role as Role);
}
