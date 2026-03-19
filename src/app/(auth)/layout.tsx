'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  AuthLayoutProvider,
  useAuthLayout,
} from '@/src/context/auth-layout-context';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle, KeyRound, LogIn, Mail, UserPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Configuração padrão para cada rota
const routeConfig: Record<
  string,
  { icon: LucideIcon; title: string; description: string }
> = {
  '/sign-in': {
    icon: LogIn,
    title: 'Bem-vindo de volta',
    description: 'Faça login na sua conta para continuar',
  },
  '/sign-up': {
    icon: UserPlus,
    title: 'Criar uma conta',
    description: 'Insira suas informações para começar',
  },
  '/forgot-password': {
    icon: Mail,
    title: 'Esqueceu sua senha?',
    description: 'Digite seu email para receber o link de redefinição',
  },
  '/reset-password': {
    icon: KeyRound,
    title: 'Redefinir senha',
    description: 'Digite sua nova senha abaixo',
  },
  '/verify-email': {
    icon: CheckCircle,
    title: 'Verificar email',
    description: 'Verificando seu endereço de email...',
  },
};

function AuthLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { icon: Icon, title, description, setHeader } = useAuthLayout();

  // Define header padrão baseado na rota
  useEffect(() => {
    const config = routeConfig[pathname];
    if (config) {
      setHeader(config.icon, config.title, config.description);
    }
  }, [pathname, setHeader]);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background com gradiente animado */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20" />

      {/* Padrão de grade decorativo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]" />

      {/* Efeitos de blur decorativos (blobs animados) */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob dark:opacity-10" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 dark:opacity-10" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 dark:opacity-10" />

      {/* Container com scroll interno */}
      <div className="relative w-full h-full flex flex-col items-center justify-between py-8 px-4 overflow-y-auto">
        {/* Spacer superior */}
        <div className="shrink-0" />

        {/* Card centralizado */}
        <Card className="relative w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-card/80 backdrop-blur-sm shrink-0 my-4">
          <CardHeader className="space-y-2 text-center pb-4">
            {/* Ícone com gradiente */}
            {Icon && (
              <div className="mx-auto w-12 h-12 rounded-2xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Icon className="w-6 h-6 text-white" />
              </div>
            )}

            {/* Título e descrição do Context */}
            {title && (
              <CardTitle className="text-xl font-bold tracking-tight">
                {title}
              </CardTitle>
            )}
            {description && (
              <CardDescription className="text-sm">
                {description}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="pb-6">{children}</CardContent>
        </Card>

        {/* Footer com logo e copyright */}
        <div className="shrink-0 flex flex-col items-center gap-2 mt-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Acme Inc
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayoutProvider>
      <AuthLayoutContent>{children}</AuthLayoutContent>
    </AuthLayoutProvider>
  );
}
