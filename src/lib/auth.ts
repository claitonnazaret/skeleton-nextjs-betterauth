import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { organization } from 'better-auth/plugins';
import { sendPasswordResetEmail, sendVerificationEmail } from './email/resend';
import prisma from './prisma';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true, // Login automático após cadastro para criar organização
    requireEmailVerification: false, // Não bloqueia login, mas email é enviado
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
  plugins: [nextCookies(), organization()],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ].filter(Boolean) as string[],
});

export type AuthSession = typeof auth.$Infer.Session.session;
export type AuthUser = typeof auth.$Infer.Session.user;
export type AuthOrganization = typeof auth.$Infer.Organization;
export type AuthActiveOrganization = typeof auth.$Infer.ActiveOrganization;
export type AuthMember = typeof auth.$Infer.Member;
export type AuthTeam = typeof auth.$Infer.Team;
export type AuthTeamMember = typeof auth.$Infer.TeamMember;

// Códigos de erro do Better Auth para comparação
export const AUTH_ERROR_CODES = auth.$ERROR_CODES;
export type AuthErrorCode = keyof typeof auth.$ERROR_CODES;
