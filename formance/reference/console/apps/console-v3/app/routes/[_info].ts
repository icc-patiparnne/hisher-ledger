// INFO: Used as health check route
import { LoaderFunction } from 'react-router';

export const loader: LoaderFunction = async () => ({ success: 'ok' });
