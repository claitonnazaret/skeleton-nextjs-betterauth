'use client';

import {
  useActiveOrganization,
  useUserOrganizations,
} from '@/src/hooks/use-active-organization';
import { authClient } from '@/src/lib/auth-client';
import { ROLE_LABELS } from '@/src/lib/permissions';
import { ChevronsUpDown, FactoryIcon, HomeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar';

export function NavOrganization() {
  const { organization, refetch } = useActiveOrganization();
  const userOrganizations = useUserOrganizations();
  const { isMobile } = useSidebar();
  const router = useRouter();

  /**
   * Troca a organization ativa
   */
  const handleSwitchOrganization = async (
    organizationId: string,
    slug: string
  ) => {
    // Se já está na organization atual, não faz nada
    if (organizationId === organization?.id) {
      return;
    }

    toast.promise(
      () =>
        new Promise<{ message: string }>(async (resolve, reject) => {
          const { error } = await authClient.organization.setActive({
            organizationId,
          });

          if (error) {
            return reject(error.message || 'Erro ao alternar empresa');
          }

          await refetch();
          return resolve({ message: 'Empresa alternada com sucesso!' });
        }),
      {
        loading: 'Aguarde...',
        success: (res: { message: string }) => {
          router.push(`/${slug}/`);
          router.refresh();
          return res.message;
        },
        error: (err) => toast.error(err || 'Erro ao alternar empresa'),
      }
    );
  };

  // const handleSwitchOrganization = async (
  //   organizationId: string,
  //   slug: string
  // ) => {
  //   // Se já está na organization atual, não faz nada
  //   if (organizationId === organization?.id || switching) {
  //     return;
  //   }

  //   try {
  //     setSwitching(true);
  //     toast.info('Alternando empresa...');

  //     // Troca a organization ativa no Better Auth
  //     const { error } = await authClient.organization.setActive({
  //       organizationId,
  //     });

  //     if (error) {
  //       toast.error(error.message || 'Erro ao alternar empresa');
  //       return;
  //     }

  //     // Recarrega os dados da nova organization
  //     await refetch();

  //     toast.success('Empresa alternada com sucesso!');

  //     // Redireciona para a nova organization
  //     router.push(`/${slug}/`);
  //     router.refresh();
  //   } catch (error) {
  //     console.error('Erro ao trocar organization:', error);
  //     toast.error('Erro ao alternar empresa');
  //   } finally {
  //     setSwitching(false);
  //   }
  // };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <HomeIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {organization?.name}
                </span>
                <span className="truncate text-xs">
                  {organization?.role &&
                    ROLE_LABELS[organization.role as keyof typeof ROLE_LABELS]}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Empresa
            </DropdownMenuLabel>
            {userOrganizations &&
              userOrganizations?.organizations.map((team, index) => {
                const isActive = team.id === organization?.id;
                return (
                  <DropdownMenuItem
                    key={team.id}
                    onClick={() => handleSwitchOrganization(team.id, team.slug)}
                    disabled={isActive}
                    className="gap-2 p-2"
                  >
                    <div
                      className={`flex size-6 items-center justify-center rounded-md border ${
                        isActive
                          ? 'border-primary bg-primary/10'
                          : 'border-border'
                      }`}
                    >
                      <FactoryIcon
                        className={`size-3.5 shrink-0 ${
                          isActive ? 'text-primary' : ''
                        }`}
                      />
                    </div>
                    <span className={isActive ? 'font-medium' : ''}>
                      {team.name}
                    </span>
                    {isActive && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        Ativa
                      </span>
                    )}
                    {!isActive && (
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    )}
                  </DropdownMenuItem>
                );
              })}
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
