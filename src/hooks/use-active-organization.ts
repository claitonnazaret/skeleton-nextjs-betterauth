/**
 * Hook para obter a organization ativa do usuário
 * Busca a organization que está atualmente selecionada na sessão
 */
'use client';

import { authClient } from '@/src/lib/auth-client';
import { useEffect, useState } from 'react';

export type ActiveOrganization = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  metadata: string | null;
  createdAt: Date;
};

export type OrganizationMember = {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: Date;
};

export type UserOrganization = ActiveOrganization & {
  role: string;
};

/**
 * Hook para acessar a organization ativa do usuário
 *
 * @returns {Object} Objeto contendo:
 *   - organization: Dados da organization ativa (ou null)
 *   - loading: Estado de carregamento
 *   - refetch: Função para recarregar os dados
 *
 * @example
 * function MyComponent() {
 *   const { organization, loading } = useActiveOrganization();
 *
 *   if (loading) return <Spinner />;
 *   if (!organization) return <div>Nenhuma empresa selecionada</div>;
 *
 *   return <div>{organization.name}</div>;
 * }
 */
export function useActiveOrganization() {
  const [organization, setOrganization] = useState<UserOrganization | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchActiveOrganization = async () => {
    try {
      setLoading(true);

      // Busca a organization ativa
      const { data: activeOrg, error: activeError } =
        await authClient.organization.getFullOrganization();

      if (activeError || !activeOrg) {
        setOrganization(null);
        return;
      }

      // Busca o role do usuário nesta organization
      const { data: listData } = await authClient.organization.list();

      // Better Auth pode retornar array direto ou objeto com propriedade organizations
      let orgsList: unknown[] = [];
      if (Array.isArray(listData)) {
        orgsList = listData;
      } else if (listData && typeof listData === 'object') {
        const dataObj = listData as Record<string, unknown>;
        if (Array.isArray(dataObj.organizations)) {
          orgsList = dataObj.organizations;
        }
      }

      const userOrg = orgsList.find(
        (org: unknown) => (org as { id: string }).id === activeOrg.id
      ) as { role?: string } | undefined;

      setOrganization({
        ...activeOrg,
        role: userOrg?.role || 'member',
      } as UserOrganization);
    } catch (error) {
      console.error('Erro ao buscar organization ativa:', error);
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrganization();
  }, []);

  return {
    organization,
    loading,
    refetch: fetchActiveOrganization,
  };
}

/**
 * Hook para listar todas as organizations do usuário
 *
 * @returns {Object} Objeto contendo:
 *   - organizations: Array de organizations do usuário
 *   - loading: Estado de carregamento
 *   - refetch: Função para recarregar os dados
 *
 * @example
 * function OrgSwitcher() {
 *   const { organizations, loading } = useUserOrganizations();
 *
 *   return (
 *     <select>
 *       {organizations.map(org => (
 *         <option key={org.id} value={org.id}>{org.name}</option>
 *       ))}
 *     </select>
 *   );
 * }
 */
export function useUserOrganizations() {
  const [organizations, setOrganizations] = useState<UserOrganization[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);

      const { data, error } = await authClient.organization.list();

      if (error || !data) {
        setOrganizations([]);
        return;
      }

      // Better Auth pode retornar array direto ou objeto com propriedade organizations
      let orgs: unknown[] = [];
      if (Array.isArray(data)) {
        orgs = data;
      } else if (data && typeof data === 'object') {
        const dataObj = data as Record<string, unknown>;
        if (Array.isArray(dataObj.organizations)) {
          orgs = dataObj.organizations;
        }
      }

      setOrganizations(orgs as UserOrganization[]);
    } catch (error) {
      console.error('Erro ao buscar organizations:', error);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return {
    organizations,
    loading,
    refetch: fetchOrganizations,
  };
}
