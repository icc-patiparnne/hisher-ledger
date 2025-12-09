import { Role, Stack } from '@platform/sdks';
import { first, get, noop, omit } from 'lodash-es';
import { redirect, Session } from 'react-router';
import httpRequest from '../../../../http/request';
import { debugLogger } from '../../../../logger/helper';
import { getBasicAuth, isAuth, throw401 } from './helper';
import {
  AuthConfig,
  Authentication,
  AuthMembershipClient,
  AuthUris,
  CurrentUser,
  OpenIdConfiguration,
  SessionCookie,
  SessionCookieConfig,
  UserInfo,
  UserInfoOrg,
} from './types';

interface PlatformAuthenticator {
  isAuthenticated(): Promise<boolean>;

  getCurrentUser(): Promise<CurrentUser | undefined>;
}

export class Authenticator implements PlatformAuthenticator {
  membershipClient: AuthMembershipClient;
  cookie: SessionCookieConfig;
  uris: AuthUris;
  request: Request;
  session: any;
  masterToken: string | undefined;
  otelTracerServiceName: string;

  constructor(config: AuthConfig, request: Request, session: any) {
    if (
      !config.membershipClient ||
      !config.cookie ||
      !config.uris ||
      !request ||
      !session
    ) {
      throw new Error('Missing config');
    }
    this.membershipClient = config.membershipClient;
    this.cookie = config.cookie;
    this.uris = config.uris;
    this.request = request;
    this.session = session;
    this.masterToken = undefined;
    this.otelTracerServiceName = config.otelTracerServiceName || 'platform';
  }

  static createSessionCookie(
    email: string,
    refreshToken: string,
    masterToken: string,
    idToken: string,
    accessToken?: string | undefined,
    version?: string | undefined
  ): SessionCookie {
    const cookie = {
      id_token: idToken,
      access_token: accessToken,
      refresh_token: refreshToken,
      master_access_token: masterToken,
      email,
      version,
    };
    debugLogger(
      process.env.DEBUG!,
      'AUTH:createSessionCookie',
      'cookie',
      cookie
    );

    return cookie;
  }

  async start(): Promise<{
    error: string | null;
    openIdConfig: OpenIdConfiguration;
    cookie: SessionCookie;
  }> {
    const url = new URL(this.request.url);
    const openIdConfig = await this.getOpenIdConfig(this.membershipClient.url);
    const error = url.searchParams.get('error');

    return {
      error,
      openIdConfig,
      cookie: await this.getParsedSession(),
    };
  }

  async getParsedSession(): Promise<SessionCookie> {
    const parsedSession = (await this.getSession())?.get(this.cookie.name);
    debugLogger(
      process.env.DEBUG!,
      'AUTH:getParsedSession',
      'parsedSession',
      parsedSession
    );

    return parsedSession;
  }

  async isAuthenticated(): Promise<boolean> {
    const parsedSession = await this.getParsedSession();

    return !!(
      parsedSession &&
      parsedSession.email &&
      parsedSession.master_access_token
    );
  }

  async getSession(): Promise<Session> {
    return await this.session?.getSession(this.request.headers.get('Cookie'));
  }

  async login(): Promise<any> {
    const url = new URL(this.request.url);
    const code = url.searchParams.get('code');
    if (code) {
      const masterAuth = await this.getAccessTokenFromCode(code).catch(
        () => undefined
      );
      if (masterAuth) {
        this.masterToken = masterAuth.access_token;
        const currentUser = await this.getCurrentUser(
          undefined,
          undefined,
          undefined,
          undefined,
          masterAuth.access_token
        );
        const cookie = Authenticator.createSessionCookie(
          currentUser.email,
          masterAuth.refresh_token,
          this.masterToken,
          masterAuth.id_token,
          undefined,
          this.cookie.version
        );
        this.session = await this.getSession();
        this.session.set(this.cookie.name, cookie);

        return this.session;
      }
    }

    return undefined;
  }

  async refreshToken(
    organizationId?: string,
    stackId?: string,
    stackUrl?: string,
    sts = false,
    withCookie = false
  ): Promise<any> {
    const parsedSession = await this.getParsedSession();
    const openIdConfig = await this.getOpenIdConfig(this.membershipClient.url);
    let stackAuth = undefined;
    if (openIdConfig && parsedSession) {
      const refreshAuth = await this.getRefreshToken(
        parsedSession.refresh_token
      );

      if (refreshAuth) {
        this.masterToken = refreshAuth.access_token;

        const currentUser = await this.getCurrentUser();
        if (currentUser) {
          if (sts && stackUrl && organizationId && stackId) {
            try {
              stackAuth = await this.getStackAuthentication(
                stackUrl,
                organizationId,
                stackId,
                refreshAuth.access_token
              );
            } catch {
              noop();
            }
          }

          const cookie = Authenticator.createSessionCookie(
            currentUser.email,
            refreshAuth.refresh_token,
            refreshAuth.access_token,
            refreshAuth.id_token,
            stackAuth && isAuth(stackAuth)
              ? stackAuth.access_token
              : parsedSession.access_token,
            parsedSession.version
          );
          this.session = await this.getSession();
          this.session.set(this.cookie.name, cookie);

          return {
            cookie: withCookie ? cookie : undefined,
          };
        }
      }
    }

    return null;
  }

  async getSts(
    stackUrl: string,
    organizationId: string,
    stackId: string
  ): Promise<any> {
    const parsedSession = await this.getParsedSession();
    const openIdConfig = await this.getOpenIdConfig(this.membershipClient.url);
    try {
      if (parsedSession && parsedSession.email) {
        if (openIdConfig) {
          const currentUser = await this.getCurrentUser();

          if (currentUser) {
            const authentication = await this.getStackAuthentication(
              stackUrl,
              organizationId,
              stackId,
              parsedSession.master_access_token
            );

            return authentication.access_token;
          }
        }
      }
    } catch {
      return redirect(this.uris.redirect.error);
    }
  }

  async logout(): Promise<any> {
    const parsedSession = await this.getParsedSession();

    try {
      const openIdConfig = await this.getOpenIdConfig(
        this.membershipClient.url
      );
      if (openIdConfig && parsedSession && parsedSession.id_token) {
        return redirect(
          `${openIdConfig.end_session_endpoint}?id_token_hint=${parsedSession.id_token}&client_id=${process.env.MEMBERSHIP_CLIENT_ID}&post_logout_redirect_uri=${this.uris.platform.oAuth}/auth/logout`
        );
      }

      return redirect('/auth/logout');
    } catch (e) {
      return redirect('/auth/logout');
    }
  }

  async getUserInfo(token: string): Promise<UserInfo | undefined> {
    const url = `${this.membershipClient.url}/userinfo`;

    return await httpRequest<UserInfo>(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        url,
      },
      undefined,
      undefined,
      undefined,
      'getUserInfo'
    );
  }

  async getCurrentUser(
    defaultOrg?: {
      id: string;
      name: string;
    },
    omitOrg?: boolean,
    defaultStackId?: string,
    defaultRegionBaseUrl?: string,
    token?: string
  ): Promise<any> {
    const omitOrganization = omitOrg === undefined ? true : omitOrg;
    const session = await this.getParsedSession();
    if ((session && session.master_access_token) || token) {
      const bearer = session?.master_access_token || token;
      const user = await this.getUserInfo(bearer!);
      const org: UserInfoOrg[] | undefined = get(user, 'org');

      if (org && user) {
        let defaultCurrentOrg = defaultOrg ? defaultOrg : first(org);

        let orga = org?.find((o) => o.id === defaultCurrentOrg?.id);
        if (!orga) {
          defaultCurrentOrg = defaultOrg ? defaultOrg : first(org);
          orga = org?.find((o) => o.id === defaultCurrentOrg?.id);
        }

        const defaultStack = defaultStackId
          ? orga?.stacks.find(
              (stack: Stack & { role: Role }) => stack.id === defaultStackId
            )
          : first(orga?.stacks);

        const currentUser = {
          id: user.sub,
          ...(omitOrganization
            ? (omit(user, ['org', 'email_verified', 'sub']) as CurrentUser)
            : omit(user, ['email_verified', 'sub'])),
          currentOrg: {
            id: defaultCurrentOrg?.id,
            name: defaultCurrentOrg?.name,
            role: orga?.role || Role.None,
          },
          currentStack: {
            id: defaultStack?.id,
            regionBaseUrl: defaultRegionBaseUrl,
            role: defaultStack?.role || Role.None,
          },
        } as CurrentUser;
        debugLogger(
          process.env.DEBUG!,
          'AUTH:getCurrentUser',
          'currentUser',
          currentUser
        );

        return currentUser;
      }

      return undefined;
    }

    return undefined;
  }

  throwUnauthorizedError = () => throw401();

  public async getOpenIdConfig(url: string) {
    const config = await httpRequest<OpenIdConfiguration>(
      {
        url: `${url}/.well-known/openid-configuration`,
      },
      undefined,
      undefined,
      undefined,
      'getOpenIdConfig'
    );

    Object.keys(config).map((key: string) => {
      const value = config[key as keyof typeof config];
      if (typeof value === 'string') {
        const s = value.split('/api');
        config[key as keyof typeof config] = `${url.replace('auth', '')}${
          s[1]
        }`;
      }
    });

    return config;
  }

  private async getStackAuthentication(
    stackUrl: string,
    organizationId: string,
    stackId: string,
    refreshToken: string
  ): Promise<any> {
    try {
      const audience = `stack://${organizationId}/${stackId}`;

      const openIdConfig = await this.getOpenIdConfig(
        this.membershipClient.url
      );

      if (openIdConfig) {
        const securityToken = await httpRequest<Authentication>(
          {
            method: 'POST',
            url: `${openIdConfig.token_endpoint}?grant_type=urn:ietf:params:oauth:grant-type:token-exchange&audience=${audience}&subject_token_type=urn:ietf:params:oauth:token-type:access_token&subject_token=${refreshToken}`,
            headers: {
              Authorization: getBasicAuth(
                this.membershipClient.id,
                this.membershipClient.secret
              ),
            },
          },
          undefined,
          undefined,
          undefined,
          'getSecurityToken'
        ).catch(() => {
          redirect(this.uris.redirect.error);
        });
        debugLogger(
          process.env.DEBUG!,
          'AUTH:getStackAuthentication',
          'sts',
          securityToken
        );

        const stackOpenIdConfig = await this.getOpenIdConfig(
          `${stackUrl}/api/auth`
        );

        if (stackOpenIdConfig && securityToken) {
          const tokenEndpoint = await httpRequest(
            {
              method: 'POST',
              url: `${stackOpenIdConfig.token_endpoint}?grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${securityToken.access_token}&scope=openid email supertoken`,
            },
            undefined,
            undefined,
            undefined,
            'getStackAuthentication'
          );
          debugLogger(
            process.env.DEBUG!,
            'AUTH:getStackAuthentication',
            'tokenEndpoint',
            tokenEndpoint
          );

          return tokenEndpoint;
        }
      }
    } catch (e) {
      return redirect(this.uris.redirect.error);
    }
  }

  private async getAccessTokenFromCode(
    code: string
  ): Promise<Authentication | void | undefined> {
    const openIdConfig = await this.getOpenIdConfig(this.membershipClient.url);

    if (openIdConfig) {
      return await httpRequest<Authentication>(
        {
          url: `${openIdConfig.token_endpoint}?grant_type=authorization_code&client_id=${this.membershipClient.id}&client_secret=${this.membershipClient.secret}&code=${code}&redirect_uri=${this.uris.platform.oAuth}${this.uris.platform.route}`,
        },
        undefined,
        undefined,
        undefined,
        'getAccessTokenFromCode'
      );
    }
  }

  private async getRefreshToken(
    refreshToken: string
  ): Promise<Authentication | void> {
    const openIdConfig = await this.getOpenIdConfig(this.membershipClient.url);

    if (openIdConfig) {
      const url = `${openIdConfig.token_endpoint}?grant_type=refresh_token&client_id=${this.membershipClient.id}&client_secret=${this.membershipClient.secret}&refresh_token=${refreshToken}`;

      const refreshedToken = await httpRequest<Authentication>(
        {
          method: 'POST',
          url,
        },
        undefined,
        undefined,
        undefined,
        'getRefreshToken'
      );

      debugLogger(
        process.env.DEBUG!,
        'AUTH:getRefreshToken',
        'refreshedToken',
        refreshedToken
      );

      return refreshedToken;
    }
  }
}
