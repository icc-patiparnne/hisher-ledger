import { ContentHeader, TypographyH3 } from '@platform/ui';
import { MODULES_NAMES } from '@platform/utils';

import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { ROUTES } from '../../../utils/routes';

export default function FlowsFavorites() {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'flows-favorites',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.FLOWS,
    routeId: 'FLOWS_OVERVIEW_FAVORITES',
    breadcrumbs: [
      {
        title: 'Flows',
        to: ROUTES({ organizationId, stackId, region })['FLOWS_OVERVIEW'].to,
      },
      {
        title: 'Favorites',
      },
    ],
  });

  return (
    <div className="col-span-12 mt-4">
      <ContentHeader
        title="Favorites"
        titleAs={TypographyH3}
        description={`
            Favorites are stored locally in your browser.
            <br />
            Clearing your browser's cache will remove them.`}
        withPadding={false}
      />
    </div>
  );
}
