import { Separator } from '@platform/ui/components/separator';
import { cn } from '@platform/ui/lib/utils';

export function DescriptionRow({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={cn('flex gap-6', className)} />;
}

export function DescriptionRowGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={cn('space-y-1', className)} />;
}

export function DescriptionRowSeparator() {
  return (
    <div>
      <Separator orientation="vertical" />
    </div>
  );
}
