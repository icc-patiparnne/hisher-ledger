import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button, buttonVariants } from '../button';

const buttonStatusVariants = cva('h-2 w-2 rounded-full', {
  variants: {
    status: {
      enabled: 'bg-mint-600',
      disabled: 'bg-orange-300',
    },
  },
});

type ButtonStatusProps = VariantProps<typeof buttonStatusVariants> &
  VariantProps<typeof buttonVariants> & {
    children: React.ReactNode;
  };

export function ButtonStatus({
  status,
  children,
  ...props
}: ButtonStatusProps) {
  return (
    <Button
      className="flex items-center gap-2"
      variant="outline"
      size="sm"
      {...props}
    >
      <div className={cn(buttonStatusVariants({ status }))}></div>
      {children}
    </Button>
  );
}
