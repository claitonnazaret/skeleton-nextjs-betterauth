'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { authClient } from '@/src/lib/auth-client';
import {
  ActivityIcon,
  FolderIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const { data: organization } = authClient.useActiveOrganization();

  const stats = [
    {
      title: 'Total de Membros',
      value: '12',
      description: '+2 este mês',
      icon: UsersIcon,
    },
    {
      title: 'Projetos Ativos',
      value: '8',
      description: '3 finalizados',
      icon: FolderIcon,
    },
    {
      title: 'Atividades',
      value: '147',
      description: '+23 hoje',
      icon: ActivityIcon,
    },
    {
      title: 'Configurações',
      value: '100%',
      description: 'Tudo configurado',
      icon: SettingsIcon,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bem-vindo, {session?.user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Aqui está um resumo das atividades em {organization?.name}
        </p>
      </div>

      {/* Grid de Cards de Estatísticas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Card de Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>
            Últimas ações realizadas na organização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <UsersIcon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Novo membro adicionado</p>
                <p className="text-xs text-muted-foreground">Há 2 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <FolderIcon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Projeto atualizado</p>
                <p className="text-xs text-muted-foreground">Há 5 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <ActivityIcon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Relatório gerado</p>
                <p className="text-xs text-muted-foreground">Há 1 dia</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <ActivityIcon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Relatório gerado</p>
                <p className="text-xs text-muted-foreground">Há 1 dia</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <ActivityIcon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Relatório gerado</p>
                <p className="text-xs text-muted-foreground">Há 1 dia</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <ActivityIcon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Relatório gerado</p>
                <p className="text-xs text-muted-foreground">Há 1 dia</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <ActivityIcon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Relatório gerado</p>
                <p className="text-xs text-muted-foreground">Há 1 dia</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <ActivityIcon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Relatório gerado</p>
                <p className="text-xs text-muted-foreground">Há 1 dia</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <ActivityIcon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Relatório gerado</p>
                <p className="text-xs text-muted-foreground">Há 1 dia</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <ActivityIcon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Relatório gerado</p>
                <p className="text-xs text-muted-foreground">Há 1 dia</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <ActivityIcon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Relatório gerado</p>
                <p className="text-xs text-muted-foreground">Há 1 dia</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <ActivityIcon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Relatório gerado</p>
                <p className="text-xs text-muted-foreground">Há 1 dia</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
