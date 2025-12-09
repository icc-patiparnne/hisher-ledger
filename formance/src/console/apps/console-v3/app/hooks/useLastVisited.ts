import { useLocalStorage } from '@uidotdev/usehooks';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router';
import { TCurrentPage } from '../components/contexts/page-context';
import { useRouteGuard } from './useRouteGuard';

type TVisitedPage = {
  routeId: string;
  url: string;
  label: string;
};

const MAX_VISITED_PAGES = 20;

const INITIAL_STORAGE = { pages: [] as TVisitedPage[] };

export function useLastVisited() {
  const { organizationId, stackId } = useRouteGuard({
    componentName: 'useLastVisited',
  });

  const location = useLocation();
  const [storage, setStorage] = useLocalStorage<typeof INITIAL_STORAGE>(
    `${organizationId}-${stackId}:visited-pages`,
    INITIAL_STORAGE
  );

  const visitedPages = useMemo(() => {
    if (!storage?.pages) {
      return [];
    }

    return storage.pages;
  }, [storage?.pages]);

  const setVisitedPage = useCallback(
    (page: TCurrentPage) => {
      const label =
        page.breadcrumbs.length === 1
          ? page.breadcrumbs[0]?.title ?? ''
          : page.breadcrumbs
              .slice(1)
              .map((crumb) => crumb.title)
              .filter(Boolean)
              .join(' / ');

      setStorage((prev) => ({
        pages: [
          {
            routeId: page.routeId,
            url: `${location.pathname}${location.search}`,
            label,
          },
          ...prev.pages.filter((p) => p.routeId !== page.routeId),
        ].slice(0, MAX_VISITED_PAGES),
      }));
    },
    [location, setStorage]
  );

  return {
    visitedPages,
    setVisitedPage,
    clearVisitedPages: useCallback(
      () => setStorage(INITIAL_STORAGE),
      [setStorage]
    ),
  };
}
