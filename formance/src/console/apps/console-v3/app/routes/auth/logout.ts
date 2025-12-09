import { logError } from '@platform/logger/helper';
import { ActionFunctionArgs, redirect } from 'react-router';
import {
  destroyAuthSession,
  getAuthenticator,
} from '../../utils/session.auth.server';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const authenticator = getAuthenticator(request);
    const session = await authenticator.getSession();
    console.info('Logging out from console-v3...');

    return redirect(`${process.env.PORTAL_UI!}`, {
      headers: {
        'Clear-Site-Data': 'cookies',
        'Set-Cookie': await destroyAuthSession(session),
      },
    });
  } catch (e) {
    return logError(e);
  }
}
