'use client';

import { InputFormField, PasswordFormField } from '@/src/components/forms';
import { Button } from '@/src/components/ui/button';
import { authClient } from '@/src/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z
  .object({
    // Dados da Empresa/Organization
    organizationName: z
      .string()
      .min(2, { message: 'Nome da empresa deve ter no mínimo 2 caracteres' }),
    organizationSlug: z
      .string()
      .min(2, { message: 'Identificador deve ter no mínimo 2 caracteres' })
      .regex(/^[a-z0-9-]+$/, {
        message: 'Apenas letras minúsculas, números e hífens',
      }),
    // Dados do Usuário
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
  const [isUserExists, setIsUserExists] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: 'Clinica Sorriso',
      organizationSlug: 'clinica-sorriso',
      name: 'Claiton Nazaret',
      email: 'claitonnazaret@gmail.com',
      password: '12345678',
      confirmPassword: '12345678',
    },
  });

  const handleOrganizationNameChange = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>
  ) => {
    // Gerar slug automaticamente do nome da organização
    const value = e.target.value;
    const slug = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por hífens
      .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
    form.setValue('organizationSlug', slug);
  };

  async function handleSignUp({
    name,
    email,
    password,
    organizationName,
    organizationSlug,
  }: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      // 1. Criar usuário (com auto-login habilitado)
      const { data: userData, error: signUpError } =
        await authClient.signUp.email({
          name,
          email,
          password,
          callbackURL: '/verify-email', // Redireciona para página de verificação
        });

      if (signUpError || !userData) {
        console.error(
          'Erro no sign-up:',
          signUpError?.code,
          signUpError?.message
        );

        // Se usuário já existe, tenta fazer login
        if (signUpError?.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
          toast.info('Usuário já existe. Fazendo login...');
          setIsUserExists(true);
          const { data: userSession, error: signInError } =
            await authClient.signIn.email({
              email,
              password,
            });

          if (signInError || !userSession) {
            setIsUserExists(false);
            toast.error('Erro ao fazer login. Verifique suas credenciais.');
            return;
          }
          // Se login bem-sucedido, continua o fluxo (criar organização)
        } else {
          toast.error(signUpError?.message || 'Erro ao realizar cadastro');
          return;
        }
      }

      // 2. Criar organização (usuário já está autenticado)
      const { data: orgData, error: orgError } =
        await authClient.organization.create({
          name: organizationName,
          slug: organizationSlug,
        });

      if (orgError || !orgData) {
        console.error('Erro ao criar organização:', orgError);
        toast.error(orgError?.message || 'Erro ao criar empresa');
        return;
      }

      // 3. Definir organização como ativa
      await authClient.organization.setActive({
        organizationId: orgData.id,
      });
      if (!isUserExists) {
        toast.success('Conta criada com sucesso! Verifique seu e-mail 📩');
      } else {
        router.push(`/${organizationSlug}/`);
      }
    } catch (error) {
      toast.error('Erro inesperado ao realizar cadastro');
      console.error('Erro no cadastro:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSignUp)} className="grid gap-3">
          {/* Seção: Dados da Empresa */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Dados da Empresa
            </h3>
            <div className="space-y-3">
              <InputFormField
                control={form.control}
                name="organizationName"
                label="Nome da Empresa"
                placeholder="Minha Empresa Ltda"
                required
                onChange={(e) => handleOrganizationNameChange(e)}
              />
              <InputFormField
                control={form.control}
                name="organizationSlug"
                label="Identificador"
                placeholder="minha-empresa"
                required
              />
            </div>
          </div>

          {/* Seção: Dados do Usuário */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Seus Dados
            </h3>
            <div className="space-y-3">
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
              <div className="grid grid-cols-2 gap-3">
                <PasswordFormField
                  control={form.control}
                  name="password"
                  label="Senha"
                  required
                />
                <PasswordFormField
                  control={form.control}
                  name="confirmPassword"
                  label="Confirmar"
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </Button>
        </form>
      </FormProvider>
      <div className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{' '}
        <Link
          href="/sign-in"
          className="underline underline-offset-4 hover:text-primary"
        >
          Faça login
        </Link>
      </div>
    </div>
  );
}
