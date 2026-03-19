'use client';

import { useCallback, useEffect, useState } from 'react';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  role: string;
  createdAt: Date;
  metadata?: string;
  memberSince: Date;
  memberId: string;
}

interface UseUserOrganizationsResult {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
}

/**
 * Hook para buscar todas as organizações do usuário autenticado
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { organizations, loading, error } = useUserOrganizations();
 *
 *   if (loading) return <div>Carregando...</div>;
 *   if (error) return <div>Erro: {error}</div>;
 *
 *   return (
 *     <div>
 *       {organizations.map(org => (
 *         <div key={org.id}>{org.name} - {org.role}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
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

/**
 * Hook para buscar organizações de um usuário específico por email
 *
 * @param email - Email do usuário
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { organizations, loading } = useUserOrganizationsByEmail('user@example.com');
 *
 *   return <div>{organizations.length} organizações</div>;
 * }
 * ```
 */
export function useUserOrganizationsByEmail(
  email: string | null
): UseUserOrganizationsResult {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchOrganizations = useCallback(async () => {
    if (!email) {
      setOrganizations([]);
      setTotal(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/organization/getOrganizationByEmail?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar organizações');
      }

      const data = await response.json();
      setOrganizations(data.organizations || []);
      setTotal(data.organizations?.length || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar organizações:', err);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return {
    organizations,
    loading,
    error,
    total,
    refetch: fetchOrganizations,
  };
}
