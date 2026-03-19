'use client';

/**
 * Página: Verificação de Email
 * Mostra sucesso na verificação de email
 *
 * Rota: /verify-email
 */

import { Button } from '@/src/components/ui/button';
import { useAuthLayout } from '@/src/context/auth-layout-context';
import { CheckCircle2, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { setHeader } = useAuthLayout();

  useEffect(() => {
    setHeader(
      Mail,
      'Email Verificado',
      'Seu email foi verificado com sucesso!'
    );
  }, [setHeader]);

  return (
    <div className="grid gap-6">
      <div className="space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>

        <div className="space-y-2 text-center">
          <p className="text-lg font-medium text-green-700">
            Email Verificado com Sucesso!
          </p>
          <p className="text-sm text-muted-foreground">
            Sua conta está pronta para uso. Agora você pode fazer login e
            acessar todos os recursos da plataforma.
          </p>
        </div>

        <Button onClick={() => router.push('/sign-in')} className="w-full">
          Ir para Login
        </Button>

        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
          <p className="text-xs text-green-800 dark:text-green-200">
            <strong>✓ Verificação Concluída:</strong> Você receberá notificações
            importantes no email cadastrado. Mantenha seu email sempre
            atualizado.
          </p>
        </div>
      </div>
    </div>
  );
}
