'use client';

import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Separator } from '@/src/components/ui/separator';

/**
 * Página: Configurações
 * Configurações da organização
 *
 * Rota: /[slug]/settings
 */
export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua organização
        </p>
      </div>

      {/* Informações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
          <CardDescription>
            Atualize as informações básicas da organização
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Nome da Organização</Label>
            <Input id="org-name" placeholder="Nome da organização" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-slug">Slug</Label>
            <Input id="org-slug" placeholder="nome-organizacao" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-description">Descrição</Label>
            <Input
              id="org-description"
              placeholder="Descrição da organização"
            />
          </div>
          <Button>Salvar Alterações</Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Preferências */}
      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
          <CardDescription>
            Configure as preferências da organização
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificações por Email</p>
              <p className="text-sm text-muted-foreground">
                Receba notificações de atividades importantes
              </p>
            </div>
            <Button variant="outline" size="sm">
              Ativar
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Convites Automáticos</p>
              <p className="text-sm text-muted-foreground">
                Permitir que membros convidem outros usuários
              </p>
            </div>
            <Button variant="outline" size="sm">
              Desativar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Zona de Perigo */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
          <CardDescription>
            Ações irreversíveis que afetam a organização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Excluir Organização</Button>
        </CardContent>
      </Card>
    </div>
  );
}
