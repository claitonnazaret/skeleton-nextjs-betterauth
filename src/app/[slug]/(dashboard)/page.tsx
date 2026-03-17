'use client';

import { Button } from '@/src/components/ui/button';
import { authClient } from '@/src/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [loading, setLoading] = useState(false);
  const { data } = authClient.useSession();
  const router = useRouter();

  async function getSlugName() {
    const { slug } = await params;
    return slug;
  }

  function handleSignOut() {
    setLoading(true);
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Logout realizado com sucesso!');
          router.replace('/sign-in');
        },
        error: (error: Error) => {
          toast.error('Erro ao realizar logout: ' + error.message);
        },
        finally: () => {
          setLoading(false);
        },
      },
    });
  }
  return (
    <div>
      <h2>Dashboard</h2>
      <h2>Slug: {getSlugName()}</h2>
      <p>Bem-vindo, {data?.user?.name}!</p>
      <Button disabled={loading} variant="destructive" onClick={handleSignOut}>
        Sair
      </Button>
    </div>
  );
}
