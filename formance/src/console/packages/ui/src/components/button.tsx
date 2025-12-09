import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { Slot as SlotPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@platform/ui/lib/utils';

const buttonVariants = cva(
  'relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        emerald: 'bg-emerald-600 text-emerald-200 hover:bg-emerald-500',
        emeraldDark: 'bg-emerald-700 text-emerald-200 hover:bg-emerald-500',
        slate: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        gold: 'bg-gold-500 text-gold-100 hover:bg-gold-400',
        lilac: 'bg-lilac-500 text-emerald-900 hover:bg-lilac-400',
        cobalt:
          'bg-cobalt-500 text-emerald-50 hover:bg-cobalt-600 dark:bg-cobalt-800 dark:text-emerald-50',
        cobaltDark: 'bg-cobalt-700 text-emerald-50 hover:bg-cobalt-600',
        mint: 'bg-mint-500 text-mint-900 hover:bg-mint-400',
        mintDark: 'bg-mint-700 text-mint-300 hover:bg-mint-800',
        outline:
          'border border-input bg-white dark:bg-transparent hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground',
        outlineDashed:
          'border border-dashed border-input bg-white dark:bg-transparent hover:bg-accent hover:text-accent-foreground',
        outlineDestructive:
          'border border-destructive-foreground bg-transparent text-destructive-foreground hover:bg-destructive/10',
        ghost:
          'hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        valid: 'bg-valid text-valid-foreground hover:bg-valid/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        info: 'bg-info text-info-foreground hover:bg-info/90',
        warning: 'bg-warning text-warning-foreground hover:bg-warning/90',

        red: 'bg-red-background text-red-foreground',
        orange: 'bg-orange-background text-orange-foreground',
        amber: 'bg-amber-background text-amber-foreground',
        yellow: 'bg-yellow-background text-yellow-foreground',
        lime: 'bg-lime-background text-lime-foreground',
        green: 'bg-green-background text-green-foreground',
        teal: 'bg-teal-background text-teal-foreground',
        cyan: 'bg-cyan-background text-cyan-foreground',
        sky: 'bg-sky-background text-sky-foreground',
        blue: 'bg-blue-background text-blue-foreground',
        indigo: 'bg-indigo-background text-indigo-foreground',
        violet: 'bg-violet-background text-violet-foreground',
        purple: 'bg-purple-background text-purple-foreground',
        fuchsia: 'bg-fuchsia-background text-fuchsia-foreground',
        pink: 'bg-pink-background text-pink-foreground',
        rose: 'bg-rose-background text-rose-foreground',
        zinc: 'bg-zinc-background text-zinc-foreground',
      },
      size: {
        sm: 'px-3 h-8',
        md: 'px-4 h-9',
        lg: 'px-8 h-10',
        'icon-sm': 'h-7 w-7 p-0.5 [&>svg]:size-3.5',
        'icon-md': 'h-8 w-8 p-1.5 [&>svg]:size-4',
        'icon-lg': 'h-9 w-9 p-2 [&>svg]:size-4',
        'icon-xl': 'h-18 w-18 p-2 [&>svg]:size-12',
      },
      notClickable: {
        true: 'pointer-events-none focus-visible:ring-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      notClickable: false,
      size: 'md',
    },
  }
);

export type TButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  };

function Button({
  className,
  variant,
  size,
  notClickable,
  asChild = false,
  loading = false,
  ...props
}: TButtonProps) {
  const Comp = asChild ? SlotPrimitive.Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, notClickable, className }))}
      {...props}
    >
      <>
        {props.children}
        {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      </>
    </Comp>
  );
}

export { Button, buttonVariants };
