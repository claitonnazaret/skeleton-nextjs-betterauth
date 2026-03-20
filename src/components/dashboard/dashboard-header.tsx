'use client';

import { Button } from '@/src/components/ui/button';
import { SidebarTrigger } from '@/src/components/ui/sidebar';
import { BellIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { AutoBreadcrumbs } from './auto-breadcrumbs';

interface DashboardHeaderProps {
  title: string;
}

/**
 * Header fixo do dashboard com:
 * - Título em evidência à esquerda
 * - Breadcrumbs automático abaixo do título
 * - Botão de notificações (sino)
 * - Botão de troca de tema
 */
export function DashboardHeader({ title }: DashboardHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="z-10 flex shrink-0 flex-col border-b bg-background">
      <div className="flex h-16 items-center gap-2 px-4">
        {/* Trigger do Sidebar para mobile */}
        <SidebarTrigger className="-ms-1" />

        {/* Título e Breadcrumbs */}
        <div className="flex flex-1 flex-col gap-1">
          <h1 className="text-lg font-semibold leading-none">{title}</h1>
          <div className="text-xs">
            <AutoBreadcrumbs />
          </div>
        </div>

        {/* Botões de ação à direita */}
        <div className="flex items-center gap-2">
          {/* Botão de notificações */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Notificações"
          >
            <BellIcon className="size-4" />
          </Button>

          {/* Botão de troca de tema */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={toggleTheme}
            aria-label="Alternar tema"
          >
            {resolvedTheme === 'dark' ? (
              <SunIcon className="size-4" />
            ) : (
              <MoonIcon className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
