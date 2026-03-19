/**
 * Componentes para renderização condicional baseada em permissões
 * Usados para controlar o que é exibido na UI baseado no role do usuário
 */
'use client';

import { usePermissions } from '@/src/hooks/use-permissions';
import { type Permission, type Role } from '@/src/lib/permissions';
import type { ReactNode } from 'react';

interface CanProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Componente para renderização condicional baseada em permissão específica
 *
 * @param permission - Permissão necessária para exibir o conteúdo
 * @param children - Conteúdo a ser exibido se tiver permissão
 * @param fallback - Conteúdo alternativo se não tiver permissão
 *
 * @example
 * <Can permission="members:invite">
 *   <Button>Convidar Membro</Button>
 * </Can>
 *
 * @example
 * <Can
 *   permission="billing:view"
 *   fallback={<div>Apenas proprietários podem ver faturamento</div>}
 * >
 *   <BillingPanel />
 * </Can>
 */
export function Can({ permission, children, fallback = null }: CanProps) {
  const { can } = usePermissions();

  if (can(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

interface CanAnyProps {
  permissions: Permission[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Componente para renderização condicional baseada em QUALQUER permissão
 *
 * @param permissions - Array de permissões (precisa ter pelo menos uma)
 * @param children - Conteúdo a ser exibido se tiver alguma permissão
 * @param fallback - Conteúdo alternativo se não tiver nenhuma permissão
 *
 * @example
 * <CanAny permissions={['members:invite', 'members:remove']}>
 *   <MembersPanel />
 * </CanAny>
 */
export function CanAny({
  permissions,
  children,
  fallback = null,
}: CanAnyProps) {
  const { canAny } = usePermissions();

  if (canAny(permissions)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

interface CanAllProps {
  permissions: Permission[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Componente para renderização condicional baseada em TODAS as permissões
 *
 * @param permissions - Array de permissões (precisa ter todas)
 * @param children - Conteúdo a ser exibido se tiver todas as permissões
 * @param fallback - Conteúdo alternativo se não tiver todas as permissões
 *
 * @example
 * <CanAll permissions={['reports:view', 'reports:export']}>
 *   <ExportButton />
 * </CanAll>
 */
export function CanAll({
  permissions,
  children,
  fallback = null,
}: CanAllProps) {
  const { canAll } = usePermissions();

  if (canAll(permissions)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

interface HasRoleProps {
  role: Role | Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Componente para renderização condicional baseada em role específico
 *
 * @param role - Role ou array de roles necessários
 * @param children - Conteúdo a ser exibido se tiver o role
 * @param fallback - Conteúdo alternativo se não tiver o role
 *
 * @example
 * <HasRole role="owner">
 *   <DangerZone />
 * </HasRole>
 *
 * @example
 * <HasRole role={['owner', 'admin']}>
 *   <AdminPanel />
 * </HasRole>
 */
export function HasRole({ role, children, fallback = null }: HasRoleProps) {
  const { role: userRole } = usePermissions();

  if (!userRole) {
    return <>{fallback}</>;
  }

  const hasRole = Array.isArray(role)
    ? role.includes(userRole)
    : role === userRole;

  if (hasRole) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

interface HasMinRoleProps {
  minRole: Role;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Componente para renderização condicional baseada em nível mínimo de role
 *
 * @param minRole - Role mínimo necessário (verifica hierarquia)
 * @param children - Conteúdo a ser exibido se tiver nível suficiente
 * @param fallback - Conteúdo alternativo se não tiver nível suficiente
 *
 * @example
 * // Exibe para admin e owner (não para member)
 * <HasMinRole minRole="admin">
 *   <AdvancedSettings />
 * </HasMinRole>
 */
export function HasMinRole({
  minRole,
  children,
  fallback = null,
}: HasMinRoleProps) {
  const { hasLevel } = usePermissions();

  if (hasLevel(minRole)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
