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
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'claitonnazaret@gmail.com',
      password: '12345678',
    },
  });

  function handleLogin(data: z.infer<typeof formSchema>) {
    toast.success('Login realizado com sucesso!' + JSON.stringify(data));
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Faça login para acessar o conteúdo exclusivo do nosso site.
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
        <Button onClick={() => handleLogin(form.getValues())}>Login</Button>
      </CardFooter>
    </>
  );
}
