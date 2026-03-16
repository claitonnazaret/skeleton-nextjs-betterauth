'use client';

import { InputFormField, PasswordFormField } from '@/src/components/forms';
import { Button } from '@/src/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'claitonnazaret@gmail.com',
      password: '12345678',
      confirmPassword: '12345678',
    },
  });

  return (
    <>
      <CardHeader>
        <CardTitle>Cadastre-se</CardTitle>
        <CardDescription>
          Crie uma conta para acessar o conteúdo exclusivo do nosso site.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <InputFormField control={form.control} name="email" label="Email" />
          <PasswordFormField
            control={form.control}
            name="password"
            label="Senha"
          />
        </FormProvider>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={() => form.handleSubmit((data) => console.log(data))()}
        >
          Cadastro
        </Button>
      </CardFooter>
    </>
  );
}
