import { TModule } from '@platform/utils';
import { Button } from '../../button';

import { cn } from '@platform/ui/lib/utils';
import { BadgeStatus } from '../../badge-status';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../card';
import { ModuleIcon } from './module-icon';

type TCardModulesProps = {
  module: TModule & {
    to?: string;
    version?: string | null;
    enabled?: boolean;
  };
  asRemixLink?: any;
} & React.HTMLAttributes<HTMLDivElement>;

function CardModules({ module, asRemixLink, className }: TCardModulesProps) {
  const Link = asRemixLink ?? 'a';

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className="flex-1">
        <div className="flex justify-between items-center">
          <Link
            {...(asRemixLink ? { to: module.to } : { href: module.to })}
            className="flex items-center gap-2.5"
          >
            <CardTitle className="flex items-center gap-2 text-base capitalize">
              <ModuleIcon name={module.name} size="icon-md" />
              {module.displayName}
            </CardTitle>
          </Link>

          <BadgeStatus variant={module.enabled ? 'valid' : 'destructive'}>
            {module.enabled ? 'Enabled' : 'Disabled'}
          </BadgeStatus>
        </div>
        <CardDescription>{module.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Link {...(asRemixLink ? { to: module.to } : { href: module.to })}>
          <Button variant="zinc" size="sm">
            Go to {module.displayName} →
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export { CardModules };
