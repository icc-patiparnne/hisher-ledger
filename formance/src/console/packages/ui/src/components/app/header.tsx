import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { FormanceIcon } from '../formance-logo';
import { SeparatorVertical } from '../separator';
import { Skeleton } from '../skeleton';

type THeaderProps = {
  left: React.ReactNode;
  center?: React.ReactNode;
  right: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const headerVariants = cva(
  'fixed flex items-center w-full top-0 left-0 right-0 z-50 bg-background border-b border-border h-12'
);

export function Header({ left, center, right, ...props }: THeaderProps) {
  return (
    <header className={cn(headerVariants(), props.className)}>
      <div className="flex flex-1 justify-between items-center px-2">
        <>{left}</>
        {center && <>{center}</>}
        <>{right}</>
      </div>
    </header>
  );
}

export function HeaderSkeleton({
  className,
  left,
  center,
  right,
  withOrganizationOnly = false,
  ...props
}: Partial<THeaderProps> & {
  withOrganizationOnly?: boolean;
}) {
  return (
    <header className={cn(headerVariants(), className)} {...props}>
      <div className="flex flex-1 justify-between items-center px-2">
        <div className="flex items-center">
          {left}
          <FormanceIcon size="sm" />
          <SeparatorVertical className="mx-1" />
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-6 w-6 ml-1" />
          {!withOrganizationOnly && (
            <>
              <SeparatorVertical className="mx-1" />
              <Skeleton className="h-6 w-24" />
            </>
          )}
        </div>

        {center && <div>{center}</div>}

        <div className="flex items-center gap-2">
          {right}
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </header>
  );
}
