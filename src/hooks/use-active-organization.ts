/**
 * Hook para obter a organization ativa do usuário
 * Busca a organization que está atualmente selecionada na sessão
 */
'use client';

import { authClient } from '@/src/lib/auth-client';
import { useCallback, useEffect, useState } from 'react';

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

type Organization = {
  memberSince: Date;
  memberId: string;
} & UserOrganization;

interface UseUserOrganizationsResult {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
}

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
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const fetchActiveOrganization = async () => {
      try {
        // Busca a organization ativa
        const { data: activeOrg, error: activeError } =
          await authClient.organization.getFullOrganization();

        if (activeError || !activeOrg) {
          setOrganization(null);
          setLoading(false);
          return;
        }

        // Busca o role do usuário atual nos members da organization
        const currentUserId = session?.user?.id;
        const userMember = activeOrg.members?.find(
          (member: { userId: string }) => member.userId === currentUserId
        ) as { role?: string } | undefined;

        setOrganization({
          ...activeOrg,
          role: userMember?.role || 'member',
        } as UserOrganization);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar organization ativa:', error);
        setOrganization(null);
        setLoading(false);
      }
    };

    fetchActiveOrganization();
  }, [session?.user?.id]);

  const refetch = useCallback(async () => {
    setLoading(true);

    try {
      // Busca a organization ativa
      const { data: activeOrg, error: activeError } =
        await authClient.organization.getFullOrganization();

      if (activeError || !activeOrg) {
        setOrganization(null);
        return;
      }

      // Busca o role do usuário atual nos members da organization
      const currentUserId = session?.user?.id;
      const userMember = activeOrg.members?.find(
        (member: { userId: string }) => member.userId === currentUserId
      ) as { role?: string } | undefined;

      setOrganization({
        ...activeOrg,
        role: userMember?.role || 'member',
      } as UserOrganization);
    } catch (error) {
      console.error('Erro ao buscar organization ativa:', error);
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  return {
    organization,
    loading,
    refetch,
  };
}

export function useUserOrganizations(): UseUserOrganizationsResult {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/organization/getUserOrganizations');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar organizações');
      }

      const data = await response.json();
      setOrganizations(data.organizations || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar organizações:', err);
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
    error,
    total,
    refetch: fetchOrganizations,
  };
}
