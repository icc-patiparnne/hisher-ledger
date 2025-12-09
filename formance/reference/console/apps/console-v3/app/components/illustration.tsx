import {
  Card,
  CardContent,
  CardFooter,
  Chip,
  TBadgeProps,
  TypographyH3,
  buttonVariants,
  cn,
} from '@platform/ui';
import { ArrowUpRightIcon } from 'lucide-react';
import { Link } from 'react-router';

type IllustrationProps = {
  src: string;
  alt: string;
  title: string;
  to: string;
  linkText?: string;
  stats?: Array<TBadgeProps & { text: string }>;
  isDisabled?: boolean;
} & React.HTMLAttributes<HTMLImageElement>;

export function DefaultIllustration({
  src,
  alt,
  title,
  to,
  linkText = 'See details',
  className,
  ...props
}: IllustrationProps) {
  return (
    <Card>
      <CardContent className="p-2">
        <Link to={to} className="w-full">
          <img
            className={cn('w-full rounded-md', className)}
            src={src}
            alt={alt}
            {...props}
          />
        </Link>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full">
          <TypographyH3>{title}</TypographyH3>

          <Link
            className={cn(
              'mt-4',
              buttonVariants({ variant: 'secondary', size: 'sm' })
            )}
            to={to}
          >
            {linkText}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export function StatsIllustration({
  src,
  alt,
  title,
  to,
  linkText = 'See details',
  className,
  stats,
  isDisabled = false,
  ...props
}: IllustrationProps) {
  return (
    <Card isDisabled={isDisabled}>
      <CardContent className="p-2">
        <Link to={to} className="w-full">
          <img
            className={cn('w-full rounded-md', className)}
            src={src}
            alt={alt}
            {...props}
          />
        </Link>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full">
          <div className="flex items-center justify-between gap-2">
            <Link className="mt-1 flex items-center gap-1" to={to}>
              <TypographyH3>{title}</TypographyH3>
              <div className="relative h-8 w-8">
                <ArrowUpRightIcon className="h-full w-full absolute transition-all duration-300 group-hover/card:-translate-y-1 group-hover/card:translate-x-1 group-hover/card:opacity-0" />
                <ArrowUpRightIcon className="h-full w-full absolute translate-y-2 -translate-x-2 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:translate-x-0 group-hover/card:opacity-100" />
              </div>
            </Link>

            <div className="flex gap-2">
              {stats?.map((badge, index) => (
                <Chip
                  key={index}
                  variant={badge.variant}
                  {...badge}
                  label={badge.text}
                />
              ))}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
