'use client';

import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  function handleSignIn() {
    router.push('/sign-in');
  }

  function handleSignUp() {
    router.push('/sign-up');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex ">
        <Button size="lg" onClick={handleSignIn}>
          Sign In
        </Button>
        <Button size="lg" onClick={handleSignUp}>
          Sign Up
        </Button>
      </main>
    </div>
  );
}
