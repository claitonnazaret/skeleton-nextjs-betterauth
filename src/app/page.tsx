'use client';

import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { LogIn, UserPlus } from 'lucide-react';
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
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-white"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold">
            Bem-vindo
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Escolha uma opção para começar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            size="lg"
            onClick={handleSignIn}
            className="w-full"
            variant="default"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Fazer Login
          </Button>
          <Button
            size="lg"
            onClick={handleSignUp}
            className="w-full"
            variant="outline"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Criar Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
