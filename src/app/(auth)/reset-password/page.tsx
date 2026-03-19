'use client';

/**
 * Página de Redefinição de Senha
 * Permite ao usuário redefinir sua senha usando o token recebido por email
 *
 * Rota: /reset-password?token=xyz789
 */

import { PasswordFormField } from '@/src/components/forms';
import { Button } from '@/src/components/ui/button';
import { CardContent } from '@/src/components/ui/card';
import { Spinner } from '@/src/components/ui/spinner';
import { useAuthLayout } from '@/src/context/auth-layout-context';
import { authClient } from '@/src/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, KeyRound, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema de validação
const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'A senha deve conter letras maiúsculas, minúsculas e números',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type ResetPasswordForm = z.infer<typeof formSchema>;
type PageStatus = 'form' | 'loading' | 'success' | 'error';

// Componente interno que usa useSearchParams
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setHeader } = useAuthLayout();
  const tokenParam = searchParams.get('token');

  // Extrai o token se vier como URL completa
  // Exemplo: se token = "http://localhost:3000/reset-password?token=abc123"
  // Extrai apenas "abc123"
  const extractToken = (tokenParam: string | null): string | null => {
    if (!tokenParam) return null;

    // Se o token parece ser uma URL (começa com http:// ou https://)
    if (tokenParam.startsWith('http://') || tokenParam.startsWith('https://')) {
      try {
        const url = new URL(tokenParam);
        // Tenta pegar o parâmetro token da URL
        const extractedToken = url.searchParams.get('token');
        if (extractedToken) return extractedToken;
      } catch {
        // Se falhar ao parsear, retorna null
        return null;
      }
    }

    // Se não for URL, retorna o token como está
    return tokenParam;
  };

  const token = extractToken(tokenParam);

  const [status, setStatus] = useState<PageStatus>(token ? 'form' : 'error');
  const [errorMessage, setErrorMessage] = useState<string>(
    token ? '' : 'Token de redefinição não fornecido ou inválido.'
  );

  // Atualiza o header baseado no estado
  useEffect(() => {
    if (status === 'error' && !token) {
      setHeader(XCircle, 'Token Inválido', errorMessage);
    } else {
      const descriptions = {
        form: 'Digite sua nova senha',
        loading: 'Processando...',
        success: 'Senha redefinida com sucesso!',
        error: 'Erro ao redefinir senha',
      };
      setHeader(KeyRound, 'Redefinir Senha', descriptions[status]);
    }
  }, [status, token, errorMessage, setHeader]);

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setErrorMessage('Token não encontrado.');
      return;
    }

    setStatus('loading');

    try {
      // Usa o método nativo do Better Auth para reset de senha
      const { error } = await authClient.resetPassword({
        newPassword: data.password,
        token,
      });

      if (error) {
        setStatus('error');
        const errorMsg =
          error.message ||
          'Falha ao redefinir senha. O token pode estar expirado ou inválido.';
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      } else {
        setStatus('success');
        toast.success('Senha redefinida com sucesso!');

        // Redireciona para o login após 3 segundos
        setTimeout(() => {
          router.push('/sign-in');
        }, 3000);
      }
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setStatus('error');
      const errorMsg = 'Erro ao processar solicitação. Tente novamente.';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Renderiza erro se não houver token
  if (status === 'error' && !token) {
    return (
      <div className="grid gap-4">
        <Button
          onClick={() => router.push('/forgot-password')}
          className="w-full"
        >
          Solicitar Novo Link
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Form State */}
      {status === 'form' && (
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <PasswordFormField
              control={form.control}
              name="password"
              label="Nova Senha"
              placeholder="Digite sua nova senha"
              required
            />
            <PasswordFormField
              control={form.control}
              name="confirmPassword"
              label="Confirmar Senha"
              placeholder="Confirme sua nova senha"
              required
            />

            <Button type="submit" className="w-full">
              Redefinir Senha
            </Button>
          </form>
        </FormProvider>
      )}

      {/* Loading State */}
      {status === 'loading' && (
        <div className="flex flex-col items-center space-y-4 py-8">
          <Spinner className="h-12 w-12 text-purple-500" />
          <p className="text-center text-sm text-muted-foreground">
            Redefinindo sua senha...
          </p>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-lg font-medium text-green-700">
              Senha redefinida com sucesso!
            </p>
            <p className="text-sm text-muted-foreground">
              Você será redirecionado para o login em breve...
            </p>
          </div>
          <Button onClick={() => router.push('/sign-in')} className="w-full">
            Ir para Login
          </Button>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && token && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-lg font-medium text-red-700">
              Falha ao Redefinir
            </p>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
          </div>
          <div className="space-y-2">
            <Button onClick={() => setStatus('form')} className="w-full">
              Tentar Novamente
            </Button>
            <Button
              onClick={() => router.push('/forgot-password')}
              variant="outline"
              className="w-full"
            >
              Solicitar Novo Link
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente principal exportado com Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <CardContent>
          <div className="flex flex-col items-center space-y-4 py-8">
            <Spinner className="h-12 w-12 text-purple-500" />
            <p className="text-center text-sm text-muted-foreground">
              Carregando...
            </p>
          </div>
        </CardContent>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
