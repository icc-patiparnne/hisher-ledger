import { AlertCircle, ArrowUpRight, Book, Code, Globe } from 'lucide-react';
import React from 'react';
import { Link, useOutletContext } from 'react-router';

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertTitle,
  AppCard,
  ContentHeader,
  SnippetsAccordion,
  TSnippet,
  TypographyH3,
} from '@platform/ui';
import {
  EXTERNAL_LINKS,
  FCTL_SNIPPETS,
  getModule,
  MODULES_LINKS,
  MODULES_NAMES,
  TModuleName,
} from '@platform/utils';

import { useMicroStack } from '../hooks/useMicroStack';
import { useRouteGuard } from '../hooks/useRouteGuard';
import { CurrentContext } from '../root';
import { TRouteId } from '../utils/routes';
import { SNIPPETS_MAPPING } from '../utils/snippets';

type ModuleResourcesProps = {
  moduleName: TModuleName;
};

// Mapping from module to corresponding route for snippets
const moduleToRouteMapping: Record<string, TRouteId> = {
  [MODULES_NAMES.LEDGER]: 'LEDGER_OVERVIEW',
  [MODULES_NAMES.CONNECTIVITY]: 'CONNECTIVITY_OVERVIEW',
  [MODULES_NAMES.WALLETS]: 'WALLETS_OVERVIEW',
  [MODULES_NAMES.FLOWS]: 'FLOWS_OVERVIEW',
  [MODULES_NAMES.RECONCILIATION]: 'RECONCILIATION_OVERVIEW',
  [MODULES_NAMES.WEBHOOKS]: 'WEBHOOKS_OVERVIEW',
  [MODULES_NAMES.AUTH]: 'OAUTH_CLIENTS_OVERVIEW',
};

export default function ModuleResources({ moduleName }: ModuleResourcesProps) {
  const { organizationId, stackId } = useRouteGuard({
    componentName: 'module-resources',
  });

  const module = getModule(moduleName);

  const context = useOutletContext<CurrentContext>();
  const { isMicroStack } = useMicroStack(context);

  const routeId = moduleToRouteMapping[moduleName];
  const fctlSnippetsKeys = routeId ? SNIPPETS_MAPPING[routeId] || [] : [];

  const fctlSnippets = fctlSnippetsKeys.map(
    (key) =>
      FCTL_SNIPPETS({
        organizationId,
        stackId,
      })[key]
  );

  const fctlSnippetsTitles = fctlSnippets.map((item) => item.title);

  return (
    <>
      <div className="col-span-12 mt-4">
        <ContentHeader
          title="Resources"
          titleAs={TypographyH3}
          withPadding={false}
        />
      </div>
      <div className="relative col-span-12 lg:col-span-8">
        {isMicroStack && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <Alert variant="destructive" className="max-w-md mx-auto my-4">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-semibold">Not available</AlertTitle>
              <AlertDescription>
                {`
              Using fctl is not yet supported on a local deployment of the Formance Platform; we're working on it!
                `}
              </AlertDescription>
              <AlertContent></AlertContent>
            </Alert>
          </div>
        )}

        <AppCard
          title="Manage with fctl"
          variant="cobaltDark"
          appIcon={Code}
          isDisabled={isMicroStack}
        >
          <SnippetsAccordion
            snippets={fctlSnippets as TSnippet[]}
            defaultValues={fctlSnippetsTitles}
            defaultOpen={true}
          />
        </AppCard>
      </div>

      <div className="col-span-12 lg:col-span-4">
        <div className="grid gap-2">
          {MODULES_LINKS[module?.name as TModuleName]
            ?.OVERVIEW_DOCUMENTATION_LINKS && (
            <Link
              to={EXTERNAL_LINKS.DOCUMENTATION.to}
              target={EXTERNAL_LINKS.DOCUMENTATION.target}
            >
              <AppCard title="Documentation" variant="emerald" appIcon={Book}>
                <ul className="text-muted-foreground space-y-2">
                  {MODULES_LINKS[
                    module?.name as TModuleName
                  ]?.OVERVIEW_DOCUMENTATION_LINKS?.map((link: any) => (
                    <li key={link.LABEL}>
                      <Link
                        to={link.LINK}
                        className="text-sm hover:text-foreground flex items-center gap-1"
                      >
                        {link.LABEL}
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </AppCard>
            </Link>
          )}

          {MODULES_LINKS[module?.name as TModuleName]
            ?.OVERVIEW_BLOG_POST_LINKS && (
            <Link
              to={EXTERNAL_LINKS.WEBSITE_BLOG.to}
              target={EXTERNAL_LINKS.WEBSITE_BLOG.target}
            >
              <AppCard title="Blog posts" variant="gold" appIcon={Globe}>
                <ul className="text-muted-foreground space-y-2">
                  {MODULES_LINKS[
                    module?.name as TModuleName
                  ]?.OVERVIEW_BLOG_POST_LINKS?.map((link: any) => (
                    <li key={link.LABEL}>
                      <Link
                        to={link.LINK}
                        className="text-sm hover:text-foreground flex items-center gap-1"
                      >
                        {link.LABEL}
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </AppCard>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
