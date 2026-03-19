'use client';

/**
 * Página: Esqueci Minha Senha
 * Permite ao usuário solicitar um email para redefinir sua senha
 *
 * Rota: /forgot-password
 */

import { InputFormField } from '@/src/components/forms';
import { Button } from '@/src/components/ui/button';
import { Spinner } from '@/src/components/ui/spinner';
import { useAuthLayout } from '@/src/context/auth-layout-context';
import { authClient } from '@/src/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema de validação
const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
});

type ForgotPasswordForm = z.infer<typeof formSchema>;
type PageStatus = 'form' | 'loading' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { setHeader } = useAuthLayout();
  const [status, setStatus] = useState<PageStatus>('form');

  // Atualiza o header baseado no estado
  useEffect(() => {
    const descriptions = {
      form: 'Digite seu email e enviaremos um link para redefinir sua senha',
      loading: 'Enviando email...',
      success: 'Email enviado com sucesso!',
    };
    setHeader(Mail, 'Esqueci Minha Senha', descriptions[status]);
  }, [status, setHeader]);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setStatus('loading');

    try {
      // Usa o método nativo do Better Auth para solicitar redefinição de senha
      // O Better Auth gerencia automaticamente a criação e validação de tokens
      const { error } = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: '/reset-password',
      });

      if (error) {
        throw new Error(error.message || 'Erro ao enviar email');
      }

      setStatus('success');
      toast.success('Email enviado com sucesso!');
    } catch (error: unknown) {
      console.error('Erro ao solicitar redefinir senha:', error);
      setStatus('form');

      // Extrai mensagem de erro
      let errorMessage = 'Erro ao processar solicitação. Tente novamente.';
      if (error && typeof error === 'object') {
        const err = error as Record<string, unknown>;
        if (typeof err.message === 'string') {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="grid gap-6">
      {/* Form State */}
      {status === 'form' && (
        <div className="grid gap-4">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <InputFormField
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="seu@email.com"
                required
              />

              <Button type="submit" className="w-full">
                Enviar Link de Redefinição
              </Button>
            </form>
          </FormProvider>

          <div className="text-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Login
            </Link>
          </div>
        </div>
      )}

      {/* Loading State */}
      {status === 'loading' && (
        <div className="flex flex-col items-center space-y-4 py-8">
          <Spinner className="h-12 w-12 text-purple-500" />
          <p className="text-center text-sm text-muted-foreground">
            Processando sua solicitação...
          </p>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-lg font-medium text-green-700">Email Enviado!</p>
            <p className="text-sm text-muted-foreground">
              Se o email fornecido estiver cadastrado em nosso sistema, você
              receberá um link para redefinir sua senha em breve.
            </p>
            <p className="text-xs text-muted-foreground">
              Verifique sua caixa de entrada e spam.
            </p>
          </div>

          <div className="space-y-2">
            <Button onClick={() => router.push('/sign-in')} className="w-full">
              Voltar para Login
            </Button>
            <Button
              onClick={() => setStatus('form')}
              variant="outline"
              className="w-full"
            >
              Enviar Novamente
            </Button>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>💡 Dica:</strong> O link de redefinição expira em 1 hora.
              Se não receber o email em alguns minutos, verifique sua pasta de
              spam ou solicite um novo link.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
