'use client';

import {
  Card,
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
    title: 'Login',
    description: 'Faça login para acessar o conteúdo exclusivo do nosso site.',
  },
  '/sign-up': {
    icon: UserPlus,
    title: 'Cadastre-se',
    description:
      'Crie uma conta para acessar o conteúdo exclusivo do nosso site.',
  },
  '/forgot-password': {
    icon: Mail,
    title: 'Esqueci Minha Senha',
    description:
      'Digite seu email e enviaremos um link para redefinir sua senha',
  },
  '/reset-password': {
    icon: KeyRound,
    title: 'Redefinir Senha',
    description: 'Digite sua nova senha',
  },
  '/verify-email': {
    icon: CheckCircle,
    title: 'Verificação de Email',
    description: 'Verificando seu email...',
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
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="w-full max-w-xs">
        <Card className="w-full sm:max-w-lg">
          <CardHeader className="text-center">
            {Icon && (
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-blue-500">
                <Icon className="h-8 w-8 text-white" />
              </div>
            )}
            {title && <CardTitle className="text-2xl">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          {children}
        </Card>
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
