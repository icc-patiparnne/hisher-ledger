import { TModuleName } from '@platform/utils';
import { createContext, ReactNode, useContext, useState } from 'react';
import { TRouteId } from '../../utils/routes';

export type TBreadcrumbPage = {
  title: string;
  to?: string;
};

export type TCurrentPage = {
  moduleName?: TModuleName;
  routeId: TRouteId;
  breadcrumbs: TBreadcrumbPage[];
};

type PageContextType = {
  currentPage: TCurrentPage;
  setCurrentPage: (page: TCurrentPage) => void;
};

const PageContext = createContext<PageContextType | undefined>(undefined);

export function PageProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<TCurrentPage>({
    moduleName: undefined,
    routeId: 'GLOBAL_OVERVIEW',
    breadcrumbs: [
      {
        title: 'Overview',
      },
    ],
  });

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error('usePageContext must be used within a PageProvider');
  }

  return context;
}
