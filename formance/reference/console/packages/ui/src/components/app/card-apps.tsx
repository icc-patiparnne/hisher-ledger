import * as React from 'react';

import { cn } from '@platform/ui/lib/utils';
import { TApp } from '@platform/apps';

import { Button } from '../button';
import { Card, CardDescription, CardTitle } from '../card';
import { CONTEXT_TYPES, ContextIcon } from '../icons';
import { Eyebrow } from '../typography';

type TCardAppsProps = {
  asRemixLink?: any;
  seeLink?: string;
  name: TApp['name'];
  displayName?: TApp['displayName'];
  slug: TApp['slug'];
  description: TApp['description'];
} & React.HTMLAttributes<HTMLDivElement>;

function CardApps({
  name,
  displayName,
  description,
  asRemixLink,
  seeLink,
  className,
}: TCardAppsProps) {
  const Link = asRemixLink ?? 'a';

  return (
    <Card className={cn('flex gap-3 h-full', className)}>
      <div className="pl-6 py-6">
        <ContextIcon type={CONTEXT_TYPES.APP} size="sm" />
      </div>

      <div className="pr-6 pt-6 pb-6 flex-2 flex flex-col justify-between">
        <div>
          <div className="grid">
            <Eyebrow>App</Eyebrow>
            <Link {...(asRemixLink ? { to: seeLink } : { href: seeLink })}>
              <CardTitle className="flex items-center gap-2 text-base">
                {displayName || name}
              </CardTitle>
            </Link>
          </div>
          {description && (
            <CardDescription className="mt-2 mb-3 line-clamp-3">
              {description}
            </CardDescription>
          )}
        </div>

        <div>
          <Button variant="secondary" size="sm" className="w-full">
            <Link
              {...(asRemixLink ? { to: seeLink } : { href: seeLink })}
              className="w-full"
            >
              Learn more →
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export { CardApps };
