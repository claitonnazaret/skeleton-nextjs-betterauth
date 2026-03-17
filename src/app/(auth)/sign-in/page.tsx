'use client';

import {
  CheckboxFormField,
  InputFormField,
  PasswordFormField,
} from '@/src/components/forms';
import { Button } from '@/src/components/ui/button';
import { CardContent, CardFooter } from '@/src/components/ui/card';
import { authClient } from '@/src/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
  rememberMe: z.boolean(),
});

export default function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function handleLogin({
    email,
    password,
    rememberMe,
  }: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        toast.error(error.message || 'Erro ao realizar login');
        return;
      }

      if (data) {
        toast.success('Login realizado com sucesso!');
        router.replace(`${data?.user.id}/`);
      }
    } catch (error) {
      toast.error('Erro inesperado ao realizar login');
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <CardContent>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleLogin)}
            className="flex flex-col gap-6"
          >
            <InputFormField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="seu@email.com"
              required
            />
            <PasswordFormField
              control={form.control}
              name="password"
              label="Senha"
              placeholder="••••••••"
              required
            />
            <div className="flex items-center justify-between">
              <CheckboxFormField
                control={form.control}
                name="rememberMe"
                label="Lembrar-me"
              />
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground text-center">
          Não tem uma conta?{' '}
          <Link href="/sign-up" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </CardFooter>
    </>
  );
}
