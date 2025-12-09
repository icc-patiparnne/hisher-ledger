import { useParams, useSearchParams } from 'react-router';
import invariant from 'tiny-invariant';
import { TRouteParams, TSearchParams } from '../types/routes';

type RouteGuardConfig<
  T extends keyof TRouteParams = never,
  S extends keyof TSearchParams = never
> = {
  componentName: string;
  requiredParams?: T[];
  requiredSearchParams?: S[];
};

export function useRouteGuard<
  T extends keyof TRouteParams = never,
  S extends keyof TSearchParams = never
>({
  componentName,
  requiredParams,
  requiredSearchParams,
}: RouteGuardConfig<T, S>) {
  const params = useParams();
  const [searchParams] = useSearchParams();

  // Always check for organizationId and stackId as they are required globally
  const { organizationId, stackId } = params;
  const region = searchParams.get('region');

  invariant(organizationId, `organizationId is required in ${componentName}`);
  invariant(stackId, `stackId is required in ${componentName}`);
  invariant(region, `region is required in ${componentName}`);

  // Check additional required route parameters
  if (requiredParams) {
    requiredParams.forEach((param) => {
      invariant(
        params[param],
        `required param ${param} is missing in ${componentName}`
      );
    });
  }

  // Check additional required search parameters
  if (requiredSearchParams) {
    requiredSearchParams.forEach((param) => {
      invariant(
        searchParams.get(param),
        `required search param ${param} is missing in ${componentName}`
      );
    });
  }

  // Return typed parameters with search params included
  return {
    organizationId,
    stackId,
    region,
    ...params,
    ...(requiredSearchParams?.reduce(
      (acc, param) => ({
        ...acc,
        [param]: searchParams.get(param),
      }),
      {}
    ) as Pick<TSearchParams, S>),
  } as {
    organizationId: string;
    stackId: string;
    region: string;
  } & Pick<TRouteParams, T> &
    Pick<TSearchParams, S>;
}
