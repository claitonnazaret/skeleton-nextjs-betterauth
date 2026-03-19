import { organizationClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  plugins: [organizationClient()],
});

export type ClientSession = typeof authClient.$Infer.Session.session;
export type ClientUser = typeof authClient.$Infer.Session.user;
export type ClientOrganization = typeof authClient.$Infer.Organization;
export type ClientActiveOrganization =
  typeof authClient.$Infer.ActiveOrganization;
export type ClientMember = typeof authClient.$Infer.Member;
export type ClientTeam = typeof authClient.$Infer.Team;
