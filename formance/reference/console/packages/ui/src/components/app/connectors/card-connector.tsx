import * as React from 'react';

import { cn } from '@platform/ui/lib/utils';

import { TConnector } from '@platform/utils';
import { Button } from '../../button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../card';
import { ConnectorIcon } from './connector-icon';

type TCardConnectorProps = {
  name: TConnector['name'];
} & Partial<Omit<TConnector, 'name'>> & {
    seeLink?: string;
    installLink?: string;
    logoBackground?: boolean;
    asRemixLink?: any;
    isAvailable?: boolean;
  } & React.HTMLAttributes<HTMLDivElement>;

function CardConnector({
  className,
  name,
  displayName,
  description,
  type,
  features,
  release,
  seeLink,
  installLink,
  logoBackground = true,
  asRemixLink,
  isAvailable = true,
  ...props
}: TCardConnectorProps) {
  const isDisabled = !isAvailable;

  const Link = asRemixLink ?? 'a';

  return (
    <Card className={cn('flex flex-col', className)} {...props}>
      <CardHeader className="flex-1">
        <div
          className={cn('flex items-center justify-between', {
            'pointer-events-none': isDisabled,
          })}
        >
          <Link
            {...(asRemixLink ? { to: seeLink } : { href: seeLink })}
            className="flex items-center gap-2.5"
          >
            <CardTitle className="flex items-center gap-2 text-base capitalize">
              <ConnectorIcon
                name={name}
                size="icon-lg"
                hasBackground={logoBackground}
                className="shrink-0"
              />
              <div className="min-w-0">{displayName}</div>
            </CardTitle>
          </Link>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {isDisabled ? (
          <Button variant="secondary" size="sm" disabled={isDisabled}>
            <span>Coming Soon</span>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Link to={seeLink}>
              <Button variant="secondary" size="sm">
                Learn more
              </Button>
            </Link>
            <Link to={installLink}>
              <Button variant="primary" size="sm">
                Install
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { CardConnector };
