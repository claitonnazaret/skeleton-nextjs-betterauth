'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Skeleton } from '@/src/components/ui/skeleton';
import { useUserOrganizations } from '@/src/hooks/use-active-organization';
import { Building2, RefreshCw } from 'lucide-react';
import Link from 'next/link';

/**
 * Componente que lista todas as organizações do usuário
 *
 * @example
 * ```tsx
 * import { UserOrganizationsList } from '@/src/components/user-organizations-list';
 *
 * export default function Page() {
 *   return <UserOrganizationsList />;
 * }
 * ```
 */
export function UserOrganizationsList() {
  const { organizations, loading, error, total, refetch } =
    useUserOrganizations();

  // Estado de carregamento
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Minhas Organizações</CardTitle>
          <CardDescription>Carregando organizações...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro ao carregar organizações</CardTitle>
          <CardDescription className="text-destructive">
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Lista vazia
  if (organizations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Minhas Organizações</CardTitle>
          <CardDescription>
            Você ainda não faz parte de nenhuma organização
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            Comece criando sua primeira organização
          </p>
          <Button asChild>
            <Link href="/organization/create">Criar Organização</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Lista de organizações
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Minhas Organizações</CardTitle>
          <CardDescription>
            Você faz parte de {total}{' '}
            {total === 1 ? 'organização' : 'organizações'}
          </CardDescription>
        </div>
        <Button onClick={refetch} variant="ghost" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {organizations.map((org) => (
            <Link key={org.id} href={`/${org.slug}`} className="block group">
              <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={org.logo || ''} alt={org.name} />
                  <AvatarFallback>
                    {org.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                      {org.name}
                    </h3>
                    <Badge variant="secondary">{org.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">/{org.slug}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Membro desde{' '}
                    {new Date(org.memberSince).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
