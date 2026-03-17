'use client';

import { InputFormField, PasswordFormField } from '@/src/components/forms';
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

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
    email: z.string().email({ message: 'Email inválido' }),
    password: z
      .string()
      .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirmação de senha obrigatória' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export default function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function handleSignUp({
    name,
    email,
    password,
  }: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: '/verify-email',
      });

      if (error) {
        toast.error(error.message || 'Erro ao realizar cadastro');
        return;
      }

      if (data) {
        toast.success('Verifique seu e-mail para ativar sua conta 📩');
        router.push('/sign-in');
      }
    } catch (error) {
      toast.error('Erro inesperado ao realizar cadastro');
      console.error('Erro no cadastro:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <CardContent>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignUp)}
            className="flex flex-col gap-6"
          >
            <InputFormField
              control={form.control}
              name="name"
              label="Nome completo"
              placeholder="Seu nome"
              required
            />
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
            <PasswordFormField
              control={form.control}
              name="confirmPassword"
              label="Confirmar senha"
              placeholder="••••••••"
              required
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground text-center">
          Já tem uma conta?{' '}
          <Link href="/sign-in" className="text-primary hover:underline">
            Faça login
          </Link>
        </p>
      </CardFooter>
    </>
  );
}
