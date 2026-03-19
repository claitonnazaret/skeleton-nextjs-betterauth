/**
 * Exemplo de Página de Configurações
 * Demonstra o uso do sistema RBAC com componentes de UI condicional
 *
 * Rota: /[userId]/(dashboard)/settings
 */
'use client';

import { Can, HasMinRole, HasRole } from '@/src/components/can';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Spinner } from '@/src/components/ui/spinner';
import { useActiveOrganization } from '@/src/hooks/use-active-organization';
import { usePermissions } from '@/src/hooks/use-permissions';
import { Building2, Crown, Shield, User } from 'lucide-react';

export default function SettingsExamplePage() {
  const { organization, loading: orgLoading } = useActiveOrganization();
  const { role, roleLabel, isOwner, isAdmin, can } = usePermissions();

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Nenhuma organização selecionada
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua organização
        </p>
      </div>

      {/* Informações do Usuário e Organização */}
      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
          <CardDescription>Sua organização e seu papel nela</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Organização</p>
              <p className="text-sm text-muted-foreground">
                {organization.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {role === 'owner' && <Crown className="h-5 w-5 text-amber-500" />}
            {role === 'admin' && <Shield className="h-5 w-5 text-blue-500" />}
            {role === 'member' && <User className="h-5 w-5 text-gray-500" />}
            <div>
              <p className="text-sm font-medium">Seu Papel</p>
              <p className="text-sm text-muted-foreground">{roleLabel}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção visível para todos */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>Acessível para todos os membros</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Todos podem visualizar essas configurações básicas.
          </p>
        </CardContent>
      </Card>

      {/* Seção para Admin+ usando HasMinRole */}
      <HasMinRole minRole="admin">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Avançadas</CardTitle>
            <CardDescription>Apenas para Admin e Owner</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Você tem permissão para acessar configurações avançadas.
            </p>

            {/* Botão condicional usando Can */}
            <Can permission="settings:update">
              <Button>Salvar Alterações</Button>
            </Can>
          </CardContent>
        </Card>
      </HasMinRole>

      {/* Seção de Membros - usando Can */}
      <Can permission="members:read">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Membros</CardTitle>
            <CardDescription>Administre os membros da equipe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Lista de membros da organização.
            </p>

            {/* Botão de convite - apenas com permissão */}
            <Can permission="members:invite">
              <Button>Convidar Novo Membro</Button>
            </Can>
          </CardContent>
        </Card>
      </Can>

      {/* Seção de Faturamento - apenas Owner */}
      <HasRole role="owner">
        <Card>
          <CardHeader>
            <CardTitle>Faturamento</CardTitle>
            <CardDescription>Apenas para Proprietários</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Gerencie o plano e faturamento da organização.
            </p>
            <Can permission="billing:manage">
              <Button>Gerenciar Assinatura</Button>
            </Can>
          </CardContent>
        </Card>
      </HasRole>

      {/* Zona de Perigo - apenas Owner */}
      <HasRole role="owner">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
            <CardDescription>
              Ações irreversíveis que afetam toda a organização
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Can permission="organization:delete">
              <Button variant="destructive">Deletar Organização</Button>
            </Can>
          </CardContent>
        </Card>
      </HasRole>

      {/* Demonstração de uso do hook usePermissions */}
      <Card>
        <CardHeader>
          <CardTitle>Debug - Suas Permissões</CardTitle>
          <CardDescription>Informações sobre seu acesso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Você é Owner?</span>{' '}
            {isOwner ? '✅ Sim' : '❌ Não'}
          </div>
          <div className="text-sm">
            <span className="font-medium">Você é Admin?</span>{' '}
            {isAdmin ? '✅ Sim' : '❌ Não'}
          </div>
          <div className="text-sm">
            <span className="font-medium">Pode convidar membros?</span>{' '}
            {can('members:invite') ? '✅ Sim' : '❌ Não'}
          </div>
          <div className="text-sm">
            <span className="font-medium">Pode deletar organização?</span>{' '}
            {can('organization:delete') ? '✅ Sim' : '❌ Não'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
