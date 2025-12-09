import { get } from 'lodash-es';
import { Authentication } from './types';

export const getBasicAuth = (id: string, secret = '') => {
  const auth = `${id}:${secret}`;
  const buff = Buffer.from(auth);
  const basic = buff.toString('base64');

  return `Basic ${basic}`;
};

export const isAuth = (auth: any): auth is Authentication =>
  auth != null && auth && typeof auth.access_token === 'string';

export const throw401 = () => {
  throw new Response('auth_unauthorized', {
    status: 401,
  });
};

export const getErrorResponseCode = (error: any): number =>
  get(error, 'response.status', get(error, 'status'));
