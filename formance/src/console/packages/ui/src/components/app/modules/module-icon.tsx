import { cva, VariantProps } from 'class-variance-authority';

import { TModuleName } from '@platform/utils';

const moduleIconVariant = cva('shrink-0', {
  variants: {
    size: {
      'icon-sm': 'w-7 h-7',
      'icon-md': 'w-8 h-8',
      'icon-lg': 'w-9 h-9',
      sm: 'w-10 h-10',
      md: 'w-12 h-12',
      lg: 'w-14 h-14',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type TModuleIconProps = {
  name: TModuleName;
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof moduleIconVariant>;

export function ModuleIcon({ name, size, className }: TModuleIconProps) {
  const Icon = MODULES_ICON[name] ?? (() => null);

  return <Icon className={moduleIconVariant({ size, className })} />;
}

const strokeWidth = 2;

const LedgerIcon = ({ className }: React.HTMLAttributes<HTMLDivElement>) => (
  <svg
    viewBox="0 0 81 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="0.215088"
      y="0.000183105"
      width="80"
      height="80"
      rx="7"
      fill="#01353C"
    />
    <g>
      <path
        d="M20.3762 68.0004H36.3762"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M44.3762 12.0004H60.3762"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M68.3762 20.0004V36.0004"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M12.3761 44.0004V60.0004"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M18.5195 40H37.2064"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M62.5509 40H43.8623"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M40.535 43.3329V62.0157"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M40.535 36.666V18.0004"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M44.3757 64.0004L64.3757 44.0004"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M16.3757 36.0004L36.3758 16.0004"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
    </g>
  </svg>
);

const ConnectivityIcon = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => (
  <svg
    viewBox="0 0 81 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="0.215088"
      y="0.000183105"
      width="80"
      height="80"
      rx="7"
      fill="#01353C"
    />
    <path
      d="M48.3218 12.037L42.2151 18.1438"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M50.2151 30.1254L42.2151 38.1254"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M50.2151 50.0187L42.2151 42.0187"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M32.1084 68.0004L38.2151 61.8937"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M32.1084 12.037L38.2151 18.1438"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M30.2151 30.1254L38.2151 38.1254"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M30.2334 50.0004L38.2151 42.0187"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M48.3218 68.0004L42.2151 61.8937"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M52.2151 12.037V24.0004"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M28.2151 68.0003V56.037"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M28.2151 12.037V24.0004"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M52.2151 68.0003V56.037"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M68.1968 48.1254L62.0901 42.0187"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M12.2334 31.912L18.3401 38.0187"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M68.1968 31.912L62.0901 38.0187"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M12.2334 48.1254L18.3401 42.0187"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M68.1968 52.0187H56.2334"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M12.2334 28.0187H24.1968"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M68.1968 28.0187H56.2334"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
    <path
      d="M12.2334 52.0187H24.1968"
      stroke="#CDCBFF"
      strokeWidth={strokeWidth}
    />
  </svg>
);

const WalletsIcon = ({ className }: React.HTMLAttributes<HTMLDivElement>) => (
  <svg
    viewBox="0 0 81 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="0.215088"
      y="0.000183105"
      width="80"
      height="80"
      rx="7"
      fill="#01353C"
    />
    <g>
      <path
        d="M54.2288 69.0495V56.9658"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M26.1562 69.0495V56.9658"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M26.1562 10.9518V23.0355"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M54.2332 10.9518V23.0355"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M26.1562 29.0759V51.0617"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M54.2332 29.0759V51.0617"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M11.1938 54.0495H23.2499"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M11.1938 26.0776H23.2499"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M57.1804 26.0776H69.2364"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M57.1804 54.0495H69.2364"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M29.1489 54.0495H51.1514"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M29.1489 26.0495H51.1514"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
    </g>
  </svg>
);

const ReconciliationIcon = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => (
  <svg
    viewBox="0 0 81 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="0.215088"
      y="0.000183105"
      width="80"
      height="80"
      rx="7"
      fill="#01353C"
    />
    <g>
      <path
        d="M20.2151 12.0007H36.2151"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M20.2151 68.0007H36.2151"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M44.2151 12.0007H60.2151"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M44.2151 68.0007H60.2151"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M68.2151 20.0007V36.0007"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M12.2151 20.0007V36.0007"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M68.2151 44.0007V60.0007"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M12.2151 44.0007V60.0007"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M28.7866 24.0007H37.9295"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M28.7866 56.0007H37.9295"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M42.501 24.0007H51.6439"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M42.501 56.0007H51.6439"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M56.2151 28.572V37.7149"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M24.2151 28.572V37.7149"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M56.2151 42.2863V51.4292"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M24.2151 42.2863V51.4292"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
    </g>
  </svg>
);

const FlowsIcon = ({ className }: React.HTMLAttributes<HTMLDivElement>) => (
  <svg
    viewBox="0 0 81 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="0.215088"
      y="0.000183105"
      width="80"
      height="80"
      rx="7"
      fill="#01353C"
    />
    <g>
      <path
        d="M22.715 57.5003L11.7249 68.4905"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M67.7373 12.5491L56.7471 23.5393"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M28.7249 57.5003L39.7151 68.4905"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M56.7249 29.5003L67.7151 40.4904"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22.715 51.4905L11.7249 40.5003"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M50.7151 23.4905L39.7249 12.5003"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M28.7249 51.4905L50.7151 29.5003"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M25.7339 41.5314V29.4476"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M53.8064 69.5003V57.4166"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M25.7339 11.4026V23.4863"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M53.8064 39.3716V51.4553"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M10.7715 26.5283H22.8275"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M38.8438 54.4973H50.8997"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M28.8596 26.5283H40.9156"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
      <path
        d="M56.9319 54.4973H68.9879"
        stroke="#CDCBFF"
        strokeWidth={strokeWidth}
      />
    </g>
  </svg>
);

export const WebhooksIcon = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => (
  <svg
    viewBox="0 0 81 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="0.215088" width="80" height="80" rx="7" fill="#749B76" />
    <line
      x1="45.342"
      y1="58.2801"
      x2="58.3675"
      y2="45.2546"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <line
      x1="21.8237"
      y1="34.4001"
      x2="34.8492"
      y2="21.3746"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <line
      x1="58.5485"
      y1="35.288"
      x2="45.5231"
      y2="22.2625"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <line
      x1="34.6682"
      y1="58.8062"
      x2="21.6427"
      y2="45.7807"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <line
      x1="42.5857"
      y1="48.586"
      x2="48.7683"
      y2="42.4033"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <line
      x1="31.4226"
      y1="37.2512"
      x2="37.6052"
      y2="31.0685"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <line
      x1="48.8542"
      y1="38.0441"
      x2="42.6716"
      y2="31.8615"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <line
      x1="37.5195"
      y1="49.2073"
      x2="31.3368"
      y2="43.0246"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <line
      x1="71.031"
      y1="31.6423"
      x2="48.981"
      y2="9.59235"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <line
      x1="30.7424"
      y1="71.3866"
      x2="8.69243"
      y2="49.3367"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <line
      x1="31.4495"
      y1="9.32023"
      x2="9.67176"
      y2="31.098"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <line
      x1="71.1936"
      y1="49.609"
      x2="49.4159"
      y2="71.3868"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
  </svg>
);

export const AuthIcon = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => (
  <svg
    viewBox="0 0 81 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="0.215088"
      width="80"
      height="80"
      rx="7"
      fill="#749B76"
      strokeWidth={strokeWidth}
    />
    <path
      d="M48.6168 9.36029L29.8376 9.36029"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <path
      d="M26.8721 11.3372L26.8721 29.1279"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <path
      d="M51.5815 11.3372L51.5815 29.1279"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <path
      d="M19.9536 36.0464H59.4887"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <path
      d="M16.9883 41.9763L16.9883 64.709"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <path
      d="M63.4419 41.9763L63.4419 64.709"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <path
      d="M33.9254 47.5466L46.5054 60.1265"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <path
      d="M46.5055 47.5477L33.9255 60.1277"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
    <path
      d="M19.9536 70.6397H59.4887"
      stroke="#F1FBF2"
      strokeWidth={strokeWidth}
    />
  </svg>
);

export const InternalServiceIcon = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 80 80"
    fill="none"
    className={className}
  >
    <rect
      x="0.215088"
      width="80"
      height="80"
      rx="7"
      fill="#7E6F4A"
      strokeWidth={strokeWidth}
    />
    <path
      d="M18.5039 27.516L8.50391 37.516"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M18.5039 52.3819L8.50391 42.3819"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M61.2207 27.516L71.2207 37.516"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M61.2437 52.359L71.2208 42.3819"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M40.9485 40L11.9722 40"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M67.7203 40L38.7439 40"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M27.4294 61.3072L37.4294 71.3072"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M52.2954 61.3072L42.2954 71.3072"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M27.4294 18.5907L37.4294 8.5907"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M26.4568 37.4016L36.4568 27.4015"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M53.4646 37.4016L43.4646 27.4015"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M26.4568 43.4645L36.4568 53.4645"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M53.4646 43.4645L43.4646 53.4645"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M52.2725 18.5679L42.2954 8.59081"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M39.9133 38.8626L39.9133 67.8389"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M39.9133 12.0909L39.9133 41.0673"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
  </svg>
);

export const BankingBridgeIcon = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => (
  <svg viewBox="0 0 80 80" fill="none" className={className}>
    <rect width="80" height="80" rx="7" fill="#0D1B25" />
    <line
      x1="36.3276"
      y1="49.6814"
      x2="64.0697"
      y2="49.6814"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="14.0652"
      y1="69.8893"
      x2="44.2047"
      y2="69.8893"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="33.9302"
      y1="9.60843"
      x2="64.0697"
      y2="9.60843"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="16.1201"
      y1="29.8163"
      x2="44.2046"
      y2="29.8163"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="70.241"
      y1="65.0887"
      x2="70.241"
      y2="15.0846"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="50.0335"
      y1="65.0887"
      x2="50.0335"
      y2="34.9493"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="30.1682"
      y1="45.2235"
      x2="30.1682"
      y2="15.084"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="9.96048"
      y1="65.0887"
      x2="9.96048"
      y2="15.0846"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="48.1776"
      y1="31.0428"
      x2="67.3573"
      y2="11.8632"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="12.2145"
      y1="67.3483"
      x2="29.3392"
      y2="50.2236"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <rect
      x="26.7378"
      y="26.3859"
      width="6.84988"
      height="6.84988"
      fill="#0D1B25"
      strokeWidth={strokeWidth}
    />
    <rect
      x="46.9456"
      y="46.2511"
      width="6.84988"
      height="6.84988"
      fill="#0D1B25"
      strokeWidth={strokeWidth}
    />
  </svg>
);

export const MODULES_ICON: Record<
  TModuleName,
  (props: { className?: string }) => React.JSX.Element
> = {
  ['LEDGER']: LedgerIcon,
  ['WALLETS']: WalletsIcon,
  ['CONNECTIVITY']: ConnectivityIcon,
  ['FLOWS']: FlowsIcon,
  ['RECONCILIATION']: ReconciliationIcon,
  ['WEBHOOKS']: WebhooksIcon,
  ['AUTH']: AuthIcon,
  ['STARGATE']: InternalServiceIcon,
  ['GATEWAY']: InternalServiceIcon,
  ['SEARCH']: InternalServiceIcon,
  ['BANKING_BRIDGE']: BankingBridgeIcon,
};
