import { cva, VariantProps } from 'class-variance-authority';
import { toast } from 'sonner';

import {
  copyToClipboard,
  formatAddress,
  formatAssetAmount,
  formatNumber,
  TFormatAssetAmountParams,
} from '@platform/utils';

import { cn } from '../../lib/utils';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip';

const chipVariants = cva(
  'items-center whitespace-nowrap w-fit rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-medium',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'box-border border border-border text-foreground',
        emerald: 'bg-emerald-600 text-emerald-200',
        slate: 'bg-emerald-300 text-emerald-800',
        lilac: 'bg-lilac-400 text-lilac-800',
        gold: 'bg-gold-500 text-emerald-100',
        cobalt: 'bg-cobalt-500 text-emerald-100',
        cobaltDark: 'bg-cobalt-700 text-emerald-100',
        mint: 'bg-mint-500 text-mint-900',
        valid: 'bg-valid text-valid-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        info: 'bg-info text-info-foreground',
        warning: 'bg-warning text-warning-foreground',

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
        xs: 'px-1.5 py-0.5 text-[10px]',
        sm: 'px-2.5 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1 text-base',
      },

      maxWidth: {
        xs: 'max-w-24 md:max-w-32 lg:max-w-40 truncate',
        sm: 'max-w-32 md:max-w-64 lg:max-w-56 truncate',
        md: 'max-w-44 md:max-w-64 lg:max-w-96 truncate',
        lg: 'max-w-44 md:max-w-64 lg:max-w-[480px] truncate',
        xl: 'max-w-44 md:max-w-64 lg:max-w-[660px] truncate',
      },

      isMono: {
        true: 'font-mono',
        false: '',
      },

      isDisabled: {
        true: 'cursor-not-allowed opacity-50',
        false: '',
      },

      isSelectable: {
        true: 'select-all',
        false: '',
      },
    },

    defaultVariants: {
      variant: 'emerald',
      size: 'md',
      isSelectable: false,
    },
  }
);

export type TChipProps = {
  label: string | number;
  copyMode?: 'none' | 'click' | 'tooltip';
  copyValue?: string;
  shouldFormatLabel?: boolean;
  tooltipContent?: string;
} & VariantProps<typeof chipVariants> &
  React.HTMLAttributes<HTMLDivElement>;

// Ability to use a chip as copy content with toolt
// Ability to use a variant depending on the props

function Chip({
  className,
  variant,
  size,
  label,
  copyMode = 'tooltip',
  copyValue,
  isSelectable,
  isMono,
  maxWidth,
  tooltipContent,
  shouldFormatLabel = true,
  ...props
}: TChipProps) {
  if (label === '' || label === null) return null;

  const isLongAddress = label.toString().length > 30;

  const newLabel = () => {
    if (shouldFormatLabel && isLongAddress) {
      return formatAddress(label.toString());
    }

    return label.toString();
  };

  const handleCopy = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    copyToClipboard(copyValue ?? tooltipContent ?? label.toString());
    toast.success(`Copied to clipboard`);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          asChild
          aria-label={label.toString()}
          data-variant={variant}
          ph-no-capture="true"
        >
          <div
            className={cn(
              chipVariants({
                variant,
                size,
                isSelectable,
                isMono,
                maxWidth,
              }),
              copyMode === 'click' && 'cursor-copy select-none',
              className
            )}
            onClick={(e) => {
              if (copyMode !== 'click') return;
              handleCopy(e);
            }}
            data-ph-no-capture="true"
            {...props}
          >
            {newLabel()}
          </div>
        </TooltipTrigger>

        {copyMode === 'tooltip' && (
          <TooltipContent
            className="cursor-copy"
            onClick={handleCopy}
            ph-no-capture="true"
          >
            <p className="font-normal max-w-44 md:max-w-64 lg:max-w-[660px] truncate">
              {tooltipContent ?? label}
            </p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

type TChipVariantTypes =
  | 'id'
  | 'organizationId'
  | 'stackId'
  | 'asset'
  | 'name'
  | 'url'
  | 'true'
  | 'false'
  | 'string'
  | 'undefined'
  | 'number'
  | 'numberPositive'
  | 'numberNegative';

const chipVariantFromType: Record<
  TChipVariantTypes,
  {
    variant: TChipProps['variant'];
    isMono: TChipProps['isMono'];
  }
> = {
  id: {
    variant: 'zinc',
    isMono: true,
  },
  organizationId: {
    variant: 'teal',
    isMono: false,
  },
  stackId: {
    variant: 'zinc',
    isMono: false,
  },
  asset: {
    variant: 'zinc',
    isMono: false,
  },
  name: {
    variant: 'info',
    isMono: false,
  },
  url: {
    variant: 'zinc',
    isMono: false,
  },
  true: {
    variant: 'valid',
    isMono: false,
  },
  false: {
    variant: 'destructive',
    isMono: false,
  },
  string: {
    variant: 'zinc',
    isMono: true,
  },
  undefined: {
    variant: 'zinc',
    isMono: false,
  },
  number: {
    variant: 'amber',
    isMono: true,
  },
  numberPositive: {
    variant: 'lime',
    isMono: true,
  },
  numberNegative: {
    variant: 'rose',
    isMono: true,
  },
};

type TChipAmountTypes =
  | 'assetAmount'
  | 'assetAmountPositive'
  | 'assetAmountNegative';

export const chipVariantFromAmountType: Record<
  TChipAmountTypes,
  {
    variant: TChipProps['variant'];
    isMono: TChipProps['isMono'];
  }
> = {
  assetAmount: {
    variant: 'amber',
    isMono: true,
  },
  assetAmountPositive: {
    variant: 'valid',
    isMono: true,
  },
  assetAmountNegative: {
    variant: 'destructive',
    isMono: true,
  },
};

type TChipAmountProps = TFormatAssetAmountParams &
  Omit<TChipProps, 'label' | 'tooltipContent' | 'isSelectable'>;

const ChipAmount = ({
  asset,
  amount,
  shouldFormat,
  ...props
}: TChipAmountProps) => {
  const variant =
    // If amount is null or undefined, we use the assetAmount variant
    amount === null || amount == undefined
      ? 'assetAmount'
      : // If amount is 0, we use the assetAmount variant
      Number(amount) === 0
      ? 'assetAmount'
      : // If amount is positive, we use the assetAmountPositive variant
      amount != null && Number(amount) > 0
      ? 'assetAmountPositive'
      : // If amount is negative, we use the assetAmountNegative variant
        'assetAmountNegative';

  return (
    <Chip
      {...chipVariantFromAmountType[variant]}
      {...props}
      label={formatAssetAmount({
        asset,
        amount,
        shouldFormat,
      })}
      tooltipContent={`${asset ?? ''} ${formatNumber(amount ?? 0)}`}
      isSelectable
      ph-no-capture="true"
    />
  );
};

type TChipAccountTypes = 'world' | 'worldAccount' | 'defaultAccount';

export const chipVariantFromAccountType: Record<
  TChipAccountTypes,
  {
    variant: TChipProps['variant'];
    isMono: TChipProps['isMono'];
  }
> = {
  world: {
    variant: 'lime',
    isMono: false,
  },
  worldAccount: {
    variant: 'lime',
    isMono: false,
  },
  defaultAccount: {
    variant: 'violet',
    isMono: false,
  },
};

type TChipAccountProps = {
  address: string;
} & Omit<TChipProps, 'label'>;

const ChipAccount = ({ address, ...props }: TChipAccountProps) => (
  <Chip
    {...chipVariantFromAccountType[
      address === 'world' ? 'worldAccount' : 'defaultAccount'
    ]}
    label={address}
    ph-no-capture="true"
    {...props}
  />
);

export { Chip, ChipAccount, ChipAmount, chipVariantFromType };
