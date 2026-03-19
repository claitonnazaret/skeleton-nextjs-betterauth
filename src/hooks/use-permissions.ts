/**
 * Hook para gerenciar permissões baseadas em roles (RBAC)
 * Verifica permissões do usuário na organization ativa
 */
'use client';

import {
  getRolePermissions,
  hasPermission,
  hasRoleLevel,
  isValidRole,
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  type Permission,
  type Role,
} from '@/src/lib/permissions';
import { useActiveOrganization } from './use-active-organization';

/**
 * Hook para verificar permissões do usuário na organization ativa
 *
 * @returns {Object} Objeto contendo:
 *   - can: Função para verificar se tem uma permissão
 *   - canAny: Função para verificar se tem qualquer uma das permissões
 *   - canAll: Função para verificar se tem todas as permissões
 *   - hasLevel: Função para verificar se tem nível mínimo de role
 *   - isOwner: true se o usuário é owner
 *   - isAdmin: true se o usuário é admin ou owner
 *   - isMember: true se o usuário é member
 *   - role: Role do usuário na organization ativa
 *   - roleLabel: Label em português do role
 *   - roleDescription: Descrição do role
 *   - permissions: Array de todas as permissões do usuário
 *   - loading: Estado de carregamento da organization
 *
 * @example
 * function MyComponent() {
 *   const { can, isOwner, role } = usePermissions();
 *
 *   if (can('members:invite')) {
 *     return <Button>Convidar Membro</Button>;
 *   }
 *
 *   if (isOwner) {
 *     return <DangerZone />;
 *   }
 *
 *   return <div>Você é {role}</div>;
 * }
 */
export function usePermissions() {
  const { organization, loading } = useActiveOrganization();

  const userRole = organization?.role;
  const validRole = userRole && isValidRole(userRole) ? userRole : null;

  /**
   * Verifica se o usuário tem uma permissão específica
   */
  const can = (permission: Permission): boolean => {
    if (!validRole) return false;
    return hasPermission(validRole, permission);
  };

  /**
   * Verifica se o usuário tem QUALQUER UMA das permissões fornecidas
   */
  const canAny = (permissions: Permission[]): boolean => {
    if (!validRole) return false;
    return permissions.some((permission) =>
      hasPermission(validRole, permission)
    );
  };

  /**
   * Verifica se o usuário tem TODAS as permissões fornecidas
   */
  const canAll = (permissions: Permission[]): boolean => {
    if (!validRole) return false;
    return permissions.every((permission) =>
      hasPermission(validRole, permission)
    );
  };

  /**
   * Verifica se o usuário tem nível mínimo de role
   */
  const hasLevel = (requiredRole: Role): boolean => {
    if (!validRole) return false;
    return hasRoleLevel(validRole, requiredRole);
  };

  // Helpers para verificação rápida de roles
  const isOwner = validRole === 'owner';
  const isAdmin = validRole === 'admin' || isOwner;
  const isMember = validRole === 'member';

  // Informações sobre o role
  const roleLabel = validRole ? ROLE_LABELS[validRole] : null;
  const roleDescription = validRole ? ROLE_DESCRIPTIONS[validRole] : null;
  const permissions = validRole ? getRolePermissions(validRole) : [];

  return {
    can,
    canAny,
    canAll,
    hasLevel,
    isOwner,
    isAdmin,
    isMember,
    role: validRole,
    roleLabel,
    roleDescription,
    permissions,
    loading,
  };
}
