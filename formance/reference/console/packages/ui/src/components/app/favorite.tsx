import { Star } from 'lucide-react';

import { Button, TButtonProps } from '@platform/ui/components/button';
import { cn } from '@platform/ui/lib/utils';

type TFavoriteProps = {
  isFavorite: boolean;
  setIsFavorite?: (isFavorite: boolean) => void;
} & TButtonProps;

export function Favorite({
  isFavorite,
  setIsFavorite,
  ...props
}: TFavoriteProps) {
  return (
    <Button
      variant="outline"
      size="icon-md"
      onClick={() => setIsFavorite?.(!isFavorite)}
      aria-pressed={isFavorite}
      {...props}
    >
      <Star
        className={cn('', {
          'fill-amber-200 stroke-amber-200': isFavorite,
          'stroke-border-border': !isFavorite,
        })}
      />
    </Button>
  );
}
