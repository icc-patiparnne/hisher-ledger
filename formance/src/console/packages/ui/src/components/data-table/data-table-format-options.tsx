'use client';

import { cn } from '../../lib/utils';
import { buttonVariants } from '../button';
import { Switch } from '../switch';

export function DataTableFormatOptions({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2 text-sm ">
      <div
        className={cn(
          buttonVariants({
            variant: 'outline',
            size: 'sm',
          }),
          'ml-auto h-8 flex gap-2'
        )}
        onClick={() => onCheckedChange(!checked)}
      >
        <Switch checked={checked} />
        Format amounts
      </div>
    </div>
  );
}
