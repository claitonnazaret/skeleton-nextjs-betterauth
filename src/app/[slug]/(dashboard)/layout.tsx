import { AppSidebar, DashboardHeader } from '@/src/components/dashboard';
import { SidebarInset, SidebarProvider } from '@/src/components/ui/sidebar';
import { auth } from '@/src/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const headersList = await headers();

  // Buscar organização pelo slug para obter o nome
  const organization = await auth.api.getFullOrganization({
    headers: headersList,
  });
  const orgName = organization?.name || slug;

  return {
    title: orgName || 'Clínica Odontológica',
    description: 'Painel de controle da clínica odontológica',
  };
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const headersList = await headers();

  // Verificar autenticação
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    redirect('/sign-in');
  }

  // Buscar organização
  const organization = await auth.api.getFullOrganization({
    headers: headersList,
  });

  if (!organization) {
    redirect('/');
  }

  return (
    <SidebarProvider>
      {/* Sidebar ocupando toda lateral esquerda */}
      <AppSidebar organizationSlug={slug} />

      {/* Conteúdo principal */}
      <SidebarInset className="flex h-screen flex-col">
        {/* Header fixo no topo - não rola */}
        <DashboardHeader title={organization.name} />

        {/* Body com scroll vertical, sem scroll horizontal - apenas esse rola */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
