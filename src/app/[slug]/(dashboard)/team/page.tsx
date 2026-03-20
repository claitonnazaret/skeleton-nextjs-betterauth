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
import { MailIcon, PlusIcon } from 'lucide-react';

/**
 * Página: Equipe
 * Gerenciamento de membros da organização
 *
 * Rota: /[slug]/team
 */
export default function TeamPage() {
  const members = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@exemplo.com',
      role: 'Administrador',
      avatar: '',
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@exemplo.com',
      role: 'Membro',
      avatar: '',
    },
    {
      id: 3,
      name: 'Pedro Oliveira',
      email: 'pedro@exemplo.com',
      role: 'Membro',
      avatar: '',
    },
    {
      id: 4,
      name: 'Ana Costa',
      email: 'ana@exemplo.com',
      role: 'Membro',
      avatar: '',
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipe</h1>
          <p className="text-muted-foreground">
            Gerencie os membros da sua organização
          </p>
        </div>
        <Button>
          <PlusIcon className="me-2 size-4" />
          Convidar Membro
        </Button>
      </div>

      {/* Lista de Membros */}
      <Card>
        <CardHeader>
          <CardTitle>Membros Ativos</CardTitle>
          <CardDescription>
            Total de {members.length} membros na organização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="size-10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MailIcon className="size-3" />
                      {member.email}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    member.role === 'Administrador' ? 'default' : 'secondary'
                  }
                >
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
