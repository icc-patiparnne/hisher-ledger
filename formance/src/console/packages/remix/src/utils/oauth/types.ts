import { Role, Stack, User } from '@platform/sdks';

export enum Errors {
  USER_INFO_EMPTY = 'user_info_empty',
  USER_ORGANISATIONS_EMPTY = 'user_organizations_empty',
  NO_CURRENT_ORG = 'no_current_org',
  TOKEN_EXPIRED = 'token_expired',
  CACHE_CLEAR = 'cache_clear',
  LOGIN_FAIL = 'login_fail',
  FORBIDDEN = 'forbidden',
  UNAUTHORIZED = 'unauthorized',
  CONTEXT_MISSING = 'context_missing',
}

export type CurrentOrg = { id: string; name: string; role: Role };
export type CurrentStack = {
  id: string;
  regionBaseUrl?: string;
  role: Role;
};
export type CurrentUser = User & {
  currentOrg: CurrentOrg;
  currentStack?: CurrentStack;
  organizations: UserInfoOrg[];
};

export type UserInfoOrg = {
  isOwner: boolean;
  id: string;
  name: string;
  stacks: (Stack & { role: Role })[];
  role: Role;
};
export type UserInfo = User & {
  org: UserInfoOrg[];
  sub?: string;
};

export type AuthMembershipClient = {
  id: string;
  secret: string;
  url: string;
};
export type AuthUris = {
  platform: {
    oAuth?: string;
    route?: string;
  };
  redirect: { error: string; success: string };
};
export type AuthConfig = {
  membershipClient: AuthMembershipClient;
  cookie: SessionCookieConfig;
  uris: AuthUris;
  otelTracerServiceName: string | undefined;
};

export type OpenIdConfiguration = {
  authorization_endpoint: string;
  userinfo_endpoint: string;
  token_endpoint: string;
  end_session_endpoint: string;
  introspection_endpoint: string;
};

export type Authentication = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  id_token: string;
  error?: string;
  error_description?: string;
};

export type SessionFlashData = {
  error: string;
};

export type SessionCookie = {
  email: string;
  master_access_token: string;
  access_token?: string | undefined;
  version?: string | undefined;
  refresh_token: string;
  id_token: string;
};
export type SessionCookieConfig = {
  name: string;
  secret: string;
  path?: string;
  sameSite?: 'lax' | 'strict' | 'none' | boolean;
  httpOnly?: boolean;
  secure?: boolean;
  version?: string;
};
