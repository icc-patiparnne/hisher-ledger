import * as React from 'react';

import { cn } from '@platform/ui/lib/utils';
import { Card, CardContent, CardDescription, CardTitle } from '../card';
import { Eyebrow } from '../typography';

type TCardActionProps = {
  asRemixLink?: any;
  to: string;
  illustration: string;
  eyebrow: string;
  title: string;
  description?: string;
  isDisabled?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

function CardActionSmall({
  asRemixLink,
  to,
  illustration,
  eyebrow,
  title,
  description,
  className,
  isDisabled,
  ...props
}: TCardActionProps) {
  const Link = asRemixLink ?? 'a';

  return (
    <Card
      className={cn('flex h-full', className)}
      isDisabled={isDisabled}
      {...props}
    >
      <CardContent className="p-4">
        <Link
          {...(asRemixLink ? { to: to } : { href: to })}
          className="block aspect-square h-16"
        >
          <img
            className={cn('w-full rounded-md', className)}
            src={illustration}
            alt={title}
          />
        </Link>
      </CardContent>

      <div className="pr-4 pt-4 pb-4 flex-2">
        <div className="grid">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Link {...(asRemixLink ? { to: to } : { href: to })}>
            <CardTitle className="flex items-center gap-2 text-lg">
              {title}
            </CardTitle>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export function CardActionLarge({
  asRemixLink,
  to,
  illustration,
  eyebrow,
  title,
  description,
  className,
  isDisabled,
  ...props
}: TCardActionProps) {
  const Link = asRemixLink ?? 'a';

  return (
    <Card
      className={cn('flex h-full', className)}
      isDisabled={isDisabled}
      {...props}
    >
      <CardContent className="p-4">
        <Link
          {...(asRemixLink ? { to: to } : { href: to })}
          className="block aspect-video w-36"
        >
          <img
            className={cn('w-full rounded-md', className)}
            src={illustration}
            alt={title}
          />
        </Link>
      </CardContent>

      <div className="pr-4 pt-4 pb-4 flex-2 flex flex-col">
        <div className="grid">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Link {...(asRemixLink ? { to: to } : { href: to })}>
            <CardTitle className="flex items-center gap-2 text-lg">
              {title}
            </CardTitle>
          </Link>
        </div>
        {description && (
          <CardDescription className="mt-1 line-clamp-2">
            {description}
          </CardDescription>
        )}
      </div>
    </Card>
  );
}

export { CardActionSmall };
