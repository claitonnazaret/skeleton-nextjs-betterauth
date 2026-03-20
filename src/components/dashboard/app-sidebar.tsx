'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/src/components/ui/sidebar';
import { authClient } from '@/src/lib/auth-client';
import {
  ChevronUp,
  FolderIcon,
  HomeIcon,
  LogOut,
  SettingsIcon,
  User2Icon,
  UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';
import { NavOrganization } from './nav-organization';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  organizationSlug: string;
  organizationName: string;
}

/**
 * Sidebar do dashboard com:
 * - Header fixo com logo/nome da organização
 * - Menu com scroll próprio
 * - Footer fixo com menu do usuário
 */
export function AppSidebar({
  organizationSlug,
  organizationName,
  ...props
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // Items do menu principal
  const menuItems = [
    {
      title: 'Dashboard',
      url: `/${organizationSlug}`,
      icon: HomeIcon,
    },
    {
      title: 'Projetos',
      url: `/${organizationSlug}/projects`,
      icon: FolderIcon,
    },
    {
      title: 'Equipe',
      url: `/${organizationSlug}/team`,
      icon: UsersIcon,
    },
    {
      title: 'Configurações',
      url: `/${organizationSlug}/settings`,
      icon: SettingsIcon,
    },
  ];

  const handleSignOut = async () => {
    toast.promise(authClient.signOut(), {
      loading: 'Saindo...',
      success: () => {
        router.replace('/sign-in');
        return 'Saída bem-sucedida!';
      },
      error: 'Erro ao sair, tente novamente',
    });
  };

  // Iniciais do usuário para o avatar
  const userInitials =
    session?.user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header fixo do Sidebar */}
      <SidebarHeader className="border-b">
        <NavOrganization />
      </SidebarHeader>

      {/* Content com scroll próprio */}
      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer fixo do Sidebar */}
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage
                      src={session?.user?.image || ''}
                      alt={session?.user?.name || 'Usuário'}
                    />
                    <AvatarFallback className="rounded-lg">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session?.user?.name || 'Usuário'}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {session?.user?.email || ''}
                    </span>
                  </div>
                  <ChevronUp className="ms-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href={`/${organizationSlug}/profile`}>
                    <User2Icon className="me-2 size-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${organizationSlug}/settings`}>
                    <SettingsIcon className="me-2 size-4" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="me-2 size-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
