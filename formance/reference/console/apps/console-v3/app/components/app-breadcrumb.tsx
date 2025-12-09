import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
} from '@platform/ui';
import { ArrowLeft } from 'lucide-react';
import { TBreadcrumbPage } from './contexts/page-context';

export default function AppBreadcrumb({
  breadcrumbs,
}: {
  breadcrumbs: TBreadcrumbPage[];
}) {
  const navigate = useNavigate();

  return (
    <Breadcrumb className="overflow-x-scroll overflow-y-hidden no-scrollbar">
      <BreadcrumbList>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        {breadcrumbs?.map((page, index) => (
          <Fragment key={page.title}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem className="truncate max-w-80 lg:max-w-[460px]">
              {index === breadcrumbs.length - 1 ? (
                <>
                  {page.to ? (
                    <BreadcrumbLink asChild>
                      <Link to={page.to}>
                        <BreadcrumbPage>{page.title}</BreadcrumbPage>
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="select-all truncate">
                      {page.title}
                    </BreadcrumbPage>
                  )}
                </>
              ) : (
                <>
                  {page.to ? (
                    <BreadcrumbLink asChild>
                      <Link className="truncate" to={page.to}>
                        {page.title}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <span className="select-all truncate">{page.title}</span>
                  )}
                </>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
