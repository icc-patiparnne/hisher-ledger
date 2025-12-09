import { useEffect } from 'react';
import {
  TCurrentPage,
  usePageContext,
} from '../components/contexts/page-context';
import { useLastVisited } from './useLastVisited';

export function useRouteUpdate(page: TCurrentPage) {
  const { setCurrentPage } = usePageContext();
  const { setVisitedPage } = useLastVisited();

  useEffect(() => {
    setCurrentPage(page);
    setVisitedPage(page);
  }, [page.routeId, JSON.stringify(page.breadcrumbs)]);
}
