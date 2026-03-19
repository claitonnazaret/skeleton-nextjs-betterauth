'use client';

import {
  CheckboxFormField,
  ComboboxFormField,
  InputFormField,
  PasswordFormField,
} from '@/src/components/forms';
import { Button } from '@/src/components/ui/button';
import { AuthOrganization } from '@/src/lib/auth';
import { authClient } from '@/src/lib/auth-client';
import { ROLE_LABELS } from '@/src/lib/permissions';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema unificado com organizationId opcional
const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
  rememberMe: z.boolean(),
  organization: z
    .object({
      label: z.string(),
      value: z.string(),
      description: z.string().optional(),
    })
    .nullable()
    .optional(),
});

type Organization = {
  id: string;
  name: string;
  slug: string;
  role?: string;
  createdAt?: Date;
  logo?: string | null;
  metadata?: unknown;
} & AuthOrganization;

export default function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
      organization: null,
    },
  });

  async function handleOrganizations() {
    const { email } = form.watch();

    setOrganizations([]);

    if (!email || !formSchema.shape.email.safeParse(email).success) {
      toast.error(
        'Por favor, insira um email válido para buscar empresas vinculadas'
      );
      return;
    }

    await fetch(
      `/api/organization/getOrganizationByEmail?email=${encodeURIComponent(email)}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res.organizations) && res.organizations.length > 0) {
          if (res.organizations > 1) {
            setOrganizations(res.organizations || []);
          } else {
            toast.info(`Vinculado a uma empresa: ${res.organizations[0].name}`);
            form.setValue('organization', {
              label: res.organizations[0].name,
              value: res.organizations[0].id,
              description: res.organizations[0].role
                ? ROLE_LABELS[
                    res.organizations[0].role as keyof typeof ROLE_LABELS
                  ]
                : '',
            });
          }
        }
      })
      .catch((error) => {
        toast.error('Erro ao buscar empresas vinculadas a este email');
        console.error('Erro ao buscar organizações:', error);
      });
  }

  async function handleCredentials({
    email,
    password,
    rememberMe,
    organization,
  }: z.infer<typeof formSchema>) {
    toast.error(
      `Email: ${form.watch('email')}, Organização: ${form.watch('organization')?.label}`
    );
    try {
      if (organizations && organizations.length > 1 && !organization) {
        form.setError('organization', {
          message: 'Selecione uma empresa para continuar',
        });
        return;
      }

      setLoading(true);

      // 1. Fazer login
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error || !data) {
        toast.error(error?.message || 'Erro ao realizar login');
        return;
      }

      const { data: orgData, error: orgsError } =
        await authClient.organization.setActive({
          organizationId: organization?.value,
        });

      if (orgsError) {
        toast.error(orgsError.message);
        return;
      }

      toast.success('Login realizado com sucesso!');
      router.replace(`/${orgData.slug}/`);
    } catch (error) {
      toast.error('Erro inesperado ao realizar login');
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleCredentials)}
          className="grid gap-4"
        >
          <InputFormField
            control={form.control}
            name="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            required
            onBlur={handleOrganizations} // Busca organizações ao perder foco
          />
          <PasswordFormField
            control={form.control}
            name="password"
            label="Senha"
            placeholder="••••••••"
            required
          />
          <CheckboxFormField
            control={form.control}
            name="rememberMe"
            label="Lembrar-me"
          />

          {organizations.length > 1 && (
            <ComboboxFormField
              control={form.control}
              name="organization"
              label="Empresa"
              showEmpty={true}
              placeholder="Selecione uma empresa"
              options={organizations.map((org) => ({
                label: org.name,
                value: org.id,
                description:
                  org.role && ROLE_LABELS[org.role as keyof typeof ROLE_LABELS],
              }))}
              required
            />
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </FormProvider>
      <div className="flex flex-col gap-4 text-center text-sm">
        <Link href="/forgot-password" className="text-primary hover:underline">
          Esqueceu sua senha?
        </Link>
        <div className="text-muted-foreground">
          Não tem uma conta?{' '}
          <Link
            href="/sign-up"
            className="underline underline-offset-4 hover:text-primary"
          >
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
