'use client';

import { authClient } from '@/src/lib/auth-client';

export default function Page() {
  const { data } = authClient.useSession();

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Bem-vindo, {data?.user?.name}!</p>
    </div>
  );
}
