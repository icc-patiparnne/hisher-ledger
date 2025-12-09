import { LoaderFunction, redirect } from 'react-router';
import {
  commitAuthSession,
  getAuthenticator,
} from '../../utils/session.auth.server';

export const loader: LoaderFunction = async ({ request }): Promise<any> => {
  const authenticator = getAuthenticator(request);
  const session = await authenticator.login();
  const urlParam = new URL(request.url);
  const state =
    urlParam.searchParams.get('state') ||
    JSON.stringify({ redirectTo: '/', from: undefined });
  const redirectTo = JSON.parse(atob(state))?.redirectTo;
  const from = JSON.parse(atob(state))?.from;
  const to = from ? from : redirectTo;
  const url = session ? to : '/auth/error';

  return redirect(url, {
    headers: session
      ? {
          'Set-Cookie': await commitAuthSession(session),
        }
      : {},
  });
};
