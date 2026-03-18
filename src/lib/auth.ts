import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { sendPasswordResetEmail, sendVerificationEmail } from './email/resend';
import prisma from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true, // Altere para true se quiser forçar verificação
    sendResetPassword: async ({ user, url }) => {
      // Envia email de redefinição de senha
      await sendPasswordResetEmail(user.email, url, user.name);
    },
    onPasswordReset: async ({ user }) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // Envia email de verificação
      await sendVerificationEmail(user.email, url, user.name);
    },
    sendOnSignUp: true, // Envia email automaticamente no cadastro
  },
  plugins: [nextCookies()],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ].filter(Boolean) as string[],
  // Configuração adicional para as rotas de API
  // O Better Auth gerencia automaticamente as rotas /api/auth/*
  // incluindo /forget-password e /reset-password
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
