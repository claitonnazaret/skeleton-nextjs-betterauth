'use client';

import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { FolderIcon, PlusIcon } from 'lucide-react';

/**
 * Página: Projetos
 * Lista todos os projetos da organização
 *
 * Rota: /[slug]/projects
 */
export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Redesenho completo do website institucional',
      status: 'Em andamento',
    },
    {
      id: 2,
      name: 'Mobile App',
      description: 'Desenvolvimento do aplicativo mobile',
      status: 'Em andamento',
    },
    {
      id: 3,
      name: 'API Integration',
      description: 'Integração com APIs de terceiros',
      status: 'Planejamento',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os projetos da organização
          </p>
        </div>
        <Button>
          <PlusIcon className="me-2 size-4" />
          Novo Projeto
        </Button>
      </div>

      {/* Lista de Projetos */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <FolderIcon className="size-6 text-primary" />
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {project.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
