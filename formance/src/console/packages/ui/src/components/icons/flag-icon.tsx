import { cva, VariantProps } from 'class-variance-authority';
import { CircleFlag } from 'react-circle-flags';
import { cn } from '../../lib/utils';

const flagIconVariants = cva('h-7 w-7', {
  variants: {},
  defaultVariants: {},
});

interface FlagIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flagIconVariants> {
  countryCode: string;
}

export function FlagIcon({ countryCode, className }: FlagIconProps) {
  return (
    <CircleFlag
      countryCode={countryCode.toLowerCase()}
      height={20}
      className={cn(flagIconVariants(), className)}
      data-country-code={countryCode}
    />
  );
}
