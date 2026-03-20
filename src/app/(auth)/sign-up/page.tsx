'use client';

import { InputFormField, PasswordFormField } from '@/src/components/forms';
import { Button } from '@/src/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/tabs';
import { authClient } from '@/src/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema para criar nova conta (usuário + empresa)
const newAccountSchema = z
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
    email: z.email({ message: 'Email inválido' }),
    password: z
      .string()
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'A senha deve conter letras maiúsculas, minúsculas e números',
      }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirmação de senha obrigatória' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

// Schema para usuário existente (apenas login + empresa)
const existingAccountSchema = z.object({
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
  // Credenciais de login
  email: z.email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'Senha obrigatória' }),
});

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'new' | 'existing'>('new');

  const router = useRouter();

  // Form para nova conta
  const newAccountForm = useForm<z.infer<typeof newAccountSchema>>({
    resolver: zodResolver(newAccountSchema),
    defaultValues: {
      organizationName: '',
      organizationSlug: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Form para conta existente
  const existingAccountForm = useForm<z.infer<typeof existingAccountSchema>>({
    resolver: zodResolver(existingAccountSchema),
    defaultValues: {
      organizationName: '',
      organizationSlug: '',
      email: '',
      password: '',
    },
  });

  // Gera slug automaticamente do nome da organização (para nova conta)
  const handleNewAccountOrgNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const slug = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por hífens
      .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
    newAccountForm.setValue('organizationSlug', slug);
  };

  // Gera slug automaticamente do nome da organização (para conta existente)
  const handleExistingAccountOrgNameChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const slug = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por hífens
      .replace(/^-+|-+$/g, ''); // Remove hífens do início e fim
    existingAccountForm.setValue('organizationSlug', slug);
  };

  // Fluxo 1: Criar nova conta (usuário + organização)
  async function handleCreateNewAccount(
    data: z.infer<typeof newAccountSchema>
  ) {
    try {
      setLoading(true);

      // 1. Criar usuário
      const { data: userData, error: signUpError } =
        await authClient.signUp.email({
          name: data.name,
          email: data.email,
          password: data.password,
          callbackURL: '/verify-email',
        });

      if (signUpError || !userData) {
        // Se email já existe, mostra erro e sugere usar a aba de login
        if (signUpError?.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
          toast.error(
            'Este email já está cadastrado. Use a aba "Já tenho conta" para criar uma nova empresa.',
            { duration: 5000 }
          );
          return;
        }
        toast.error(signUpError?.message || 'Erro ao criar conta');
        return;
      }

      // 2. Criar organização
      const { data: orgData, error: orgError } =
        await authClient.organization.create({
          name: data.organizationName,
          slug: data.organizationSlug,
        });

      if (orgError || !orgData) {
        toast.error(orgError?.message || 'Erro ao criar empresa');
        return;
      }

      // 3. Definir organização como ativa
      await authClient.organization.setActive({
        organizationId: orgData.id,
      });

      toast.success('Conta criada com sucesso! Verifique seu e-mail 📩');
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      toast.error('Erro inesperado ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  // Fluxo 2: Usar conta existente (login + criar organização)
  async function handleUseExistingAccount(
    data: z.infer<typeof existingAccountSchema>
  ) {
    try {
      setLoading(true);

      // 1. Fazer login
      const { data: userSession, error: signInError } =
        await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });

      if (signInError || !userSession) {
        toast.error(
          signInError?.message ||
            'Erro ao fazer login. Verifique suas credenciais.'
        );
        return;
      }

      // 2. Criar organização
      const { data: orgData, error: orgError } =
        await authClient.organization.create({
          name: data.organizationName,
          slug: data.organizationSlug,
        });

      if (orgError || !orgData) {
        toast.error(orgError?.message || 'Erro ao criar empresa');
        return;
      }

      // 3. Definir organização como ativa
      await authClient.organization.setActive({
        organizationId: orgData.id,
      });

      toast.success('Empresa criada com sucesso!');
      router.push(`/${data.organizationSlug}/`);
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      toast.error('Erro inesperado ao criar empresa');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
      <Tabs
        defaultValue="new"
        value={mode}
        onValueChange={(value) => setMode(value as 'new' | 'existing')}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new">Criar nova conta</TabsTrigger>
          <TabsTrigger value="existing">Já tenho conta</TabsTrigger>
        </TabsList>

        {/* Tab: Criar nova conta */}
        <TabsContent value="new">
          <FormProvider {...newAccountForm}>
            <form
              onSubmit={newAccountForm.handleSubmit(handleCreateNewAccount)}
              className="grid gap-3"
            >
              {/* Seção: Dados da Empresa */}
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Dados da Empresa
                </h3>
                <div className="space-y-3">
                  <InputFormField
                    control={newAccountForm.control}
                    name="organizationName"
                    label="Nome da Empresa"
                    placeholder="Minha Empresa Ltda"
                    required
                    onChange={handleNewAccountOrgNameChange}
                  />
                  <InputFormField
                    control={newAccountForm.control}
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
                    control={newAccountForm.control}
                    name="name"
                    label="Nome completo"
                    placeholder="Seu nome"
                    required
                  />
                  <InputFormField
                    control={newAccountForm.control}
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <PasswordFormField
                      control={newAccountForm.control}
                      name="password"
                      label="Senha"
                      required
                    />
                    <PasswordFormField
                      control={newAccountForm.control}
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
        </TabsContent>

        {/* Tab: Já tenho conta */}
        <TabsContent value="existing">
          <FormProvider {...existingAccountForm}>
            <form
              onSubmit={existingAccountForm.handleSubmit(
                handleUseExistingAccount
              )}
              className="grid gap-3"
            >
              {/* Seção: Dados da Empresa */}
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Dados da Nova Empresa
                </h3>
                <div className="space-y-3">
                  <InputFormField
                    control={existingAccountForm.control}
                    name="organizationName"
                    label="Nome da Empresa"
                    placeholder="Minha Empresa Ltda"
                    required
                    onChange={handleExistingAccountOrgNameChange}
                  />
                  <InputFormField
                    control={existingAccountForm.control}
                    name="organizationSlug"
                    label="Identificador"
                    placeholder="minha-empresa"
                    required
                  />
                </div>
              </div>

              {/* Seção: Credenciais de Login */}
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Suas Credenciais
                </h3>
                <div className="space-y-3">
                  <InputFormField
                    control={existingAccountForm.control}
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                  />
                  <PasswordFormField
                    control={existingAccountForm.control}
                    name="password"
                    label="Senha"
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? 'Criando empresa...' : 'Criar empresa'}
              </Button>
            </form>
          </FormProvider>
        </TabsContent>
      </Tabs>

      <div className="text-center text-sm text-muted-foreground">
        Já tem uma empresa cadastrada?{' '}
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
