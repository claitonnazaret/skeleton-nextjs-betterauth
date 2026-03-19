'use client';

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
  const { title, description, setHeader } = useAuthLayout();

  // Define header padrão baseado na rota
  useEffect(() => {
    const config = routeConfig[pathname];
    if (config) {
      setHeader(config.icon, config.title, config.description);
    }
  }, [pathname, setHeader]);

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Lado Esquerdo - Banner/Imagem */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-linear-to-br from-purple-600 via-blue-600 to-indigo-700" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Acme Inc
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Esta plataforma revolucionou a forma como gerenciamos
              nossos projetos e equipes. A interface intuitiva e os recursos
              poderosos nos ajudaram a aumentar nossa produtividade.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-112.5">
          <div className="flex flex-col space-y-2 text-center">
            {title && (
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {children}
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
