import { cva, VariantProps } from 'class-variance-authority';

export const CONTEXT_TYPES = {
  ORGANIZATION: 'ORGANIZATION',
  STACK: 'STACK',
  APP: 'APP',
} as const;

export type TContextType = (typeof CONTEXT_TYPES)[keyof typeof CONTEXT_TYPES];

const contextIconVariant = cva('shrink-0', {
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

type TContextIconProps = {
  type: TContextType;
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof contextIconVariant>;

export function ContextIcon({ type, size, className }: TContextIconProps) {
  const Icon = CONTEXT_ICON[type] ?? (() => null);

  return <Icon className={contextIconVariant({ size, className })} />;
}

const strokeWidth = 2;

const OrganizationIcon = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => (
  <svg
    viewBox="0 0 80 81"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect y="0.774536" width="80" height="80" rx="7" fill="#517452" />
    <path
      d="M64.7046 40.9403H15.9585"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M68.0913 13.0854L45.5421 35.6346"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M34.7895 46.2461L12.2402 68.7953"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M68.0208 68.8659L45.4716 46.3167"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M34.8601 35.564L12.3109 13.0148"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path d="M8 51.2201L8 69.79" stroke="#D5E1E1" strokeWidth={strokeWidth} />
    <path d="M72 11.759L72 30.329" stroke="#D5E1E1" strokeWidth={strokeWidth} />
    <path
      d="M40.1658 65.8108L40.1658 17.0647"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M50.4456 8.77454L69.0155 8.77454"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M10.9845 72.7745L29.5544 72.7745"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M29.5544 8.77454L10.9845 8.77454"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M69.0155 72.7745L50.4456 72.7745"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path d="M72 51.2201L72 69.79" stroke="#D5E1E1" strokeWidth={strokeWidth} />
    <path d="M8 11.759L8 30.329" stroke="#D5E1E1" strokeWidth={strokeWidth} />
    <rect
      x="36.5182"
      y="37.2927"
      width="7.29534"
      height="7.29534"
      fill="#517452"
    />
  </svg>
);

const StackIcon = ({ className }: React.HTMLAttributes<HTMLDivElement>) => (
  <svg
    viewBox="0 0 80 81"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect y="0.774536" width="80" height="80" rx="7" fill="#265070" />
    <path
      d="M10.768 48.4708V65.831"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M32.3517 70.0548H14.9915"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M47.8464 11.3923H65.2066"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M69.4305 32.9364V15.6159"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M47.846 70.0546L65.2062 70.0546"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M69.4304 48.4708L69.4304 65.8311"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M10.7677 32.9761L10.7677 15.6159"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M32.3125 11.3924L14.992 11.3924"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M36.8067 40.1674L19.4862 40.1674"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="40.3198"
      y1="36.6799"
      x2="40.3198"
      y2="19.0421"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <path
      d="M43.5352 40.1672L60.8557 40.1672"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="39.9951"
      y1="43.9241"
      x2="39.9951"
      y2="61.2469"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
  </svg>
);

const AppIcon = ({ className }: React.HTMLAttributes<HTMLDivElement>) => (
  <svg
    viewBox="0 0 80 81"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect y="0.774536" width="80" height="80" rx="7" fill="#01353C" />
    <line
      x1="33.4087"
      y1="49.7353"
      x2="62.4088"
      y2="49.7353"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="14.2949"
      y1="69.1786"
      x2="43.2951"
      y2="69.1786"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="33.4087"
      y1="11.1783"
      x2="62.4088"
      y2="11.1783"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="14.2949"
      y1="30.6215"
      x2="43.2951"
      y2="30.6216"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="68.4039"
      y1="45.3882"
      x2="68.4039"
      y2="16.388"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="48.9603"
      y1="64.502"
      x2="48.9603"
      y2="35.5018"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="29.8475"
      y1="45.3882"
      x2="29.8475"
      y2="16.388"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="10.4039"
      y1="64.502"
      x2="10.4039"
      y2="35.5018"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="47.1586"
      y1="31.7848"
      x2="65.6132"
      y2="13.3302"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
    <line
      x1="12.5555"
      y1="66.7168"
      x2="29.0329"
      y2="50.2394"
      stroke="#D5E1E1"
      strokeWidth={strokeWidth}
    />
  </svg>
);

export const CONTEXT_ICON: Record<
  TContextType,
  (props: { className?: string }) => React.JSX.Element
> = {
  ['ORGANIZATION']: OrganizationIcon,
  ['STACK']: StackIcon,
  ['APP']: AppIcon,
};
