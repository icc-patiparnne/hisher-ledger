import { useSubmit } from 'react-router';
import { AUTH_ACTION_REDIRECT_PORTAL } from '../routes/auth/constants';
import { TRouteParamsWithSearchParams } from '../types/routes';
import { ACTIONS_ROUTES } from '../utils/actions';

export function usePortal({
  organizationId,
  stackId,
}: Pick<TRouteParamsWithSearchParams, 'organizationId' | 'stackId'>) {
  const submit = useSubmit();

  const redirectToPortal = () => {
    const formData = new FormData();
    formData.append('stackId', stackId);
    formData.append('organizationId', organizationId);

    submit(formData, {
      method: 'post',
      action: ACTIONS_ROUTES({})[AUTH_ACTION_REDIRECT_PORTAL].to,
    });
  };

  return {
    redirectToPortal,
  };
}
