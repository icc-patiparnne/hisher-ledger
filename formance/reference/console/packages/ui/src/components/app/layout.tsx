import { cn } from '@platform/ui/lib/utils';

import {
  CONNECTORS_NAMES,
  MODULES_NAMES,
  TConnectorName,
  TModuleName,
  TModuleType,
} from '@platform/utils';

import {
  CONTEXT_TYPES,
  ContextIcon,
  TContextType,
} from '../icons/context-icon';
import { Separator } from '../separator';
import {
  Eyebrow,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyH5,
  TypographyP,
} from '../typography';
import { ConnectorIcon } from './connectors/connector-icon';
import { ModuleIcon } from './modules/module-icon';

// Context mapping for automatic eyebrow and icon
const CONTEXT_MAPPING: Record<
  TContextType,
  { eyebrow: string; icon: TContextType }
> = {
  [CONTEXT_TYPES.ORGANIZATION]: {
    eyebrow: 'Organization',
    icon: CONTEXT_TYPES.ORGANIZATION,
  },
  [CONTEXT_TYPES.STACK]: {
    eyebrow: 'Stack',
    icon: CONTEXT_TYPES.STACK,
  },
  [CONTEXT_TYPES.APP]: {
    eyebrow: 'App',
    icon: CONTEXT_TYPES.APP,
  },
};

export type TContentHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  titleAs?:
    | typeof TypographyH2
    | typeof TypographyH3
    | typeof TypographyH4
    | typeof TypographyH5;
  context?: TModuleName | TConnectorName | TContextType | TModuleType;
  iconCustom?: TModuleName | TConnectorName | TContextType;
  withPadding?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function ContentHeader({
  eyebrow,
  title,
  description,
  context,
  iconCustom,
  withPadding = true,
  className,
  titleAs,
  ...props
}: TContentHeaderProps) {
  // Auto-map context to eyebrow and icon if context is a TContextType
  const isContextType =
    context && Object.values(CONTEXT_TYPES).includes(context as TContextType);
  const contextMapping = isContextType
    ? CONTEXT_MAPPING[context as TContextType]
    : null;

  // Use provided eyebrow/iconCustom or fall back to context mapping
  const finalEyebrow = eyebrow || contextMapping?.eyebrow;
  const finalIconCustom = iconCustom || contextMapping?.icon;

  const renderIcon = () => {
    if (!finalIconCustom) return null;

    if (Object.values(MODULES_NAMES).includes(finalIconCustom as TModuleName)) {
      return <ModuleIcon name={finalIconCustom as TModuleName} size="md" />;
    }

    if (
      Object.values(CONNECTORS_NAMES).includes(
        finalIconCustom as TConnectorName
      )
    ) {
      return (
        <ConnectorIcon name={finalIconCustom as TConnectorName} size="md" />
      );
    }

    if (
      Object.values(CONTEXT_TYPES).includes(finalIconCustom as TContextType)
    ) {
      return <ContextIcon type={finalIconCustom as TContextType} size="md" />;
    }

    return null;
  };

  const Title = titleAs || TypographyH2;

  return (
    <div
      className={cn(
        'flex items-center justify-between',
        {
          'py-4 md:py-8': withPadding,
        },
        className
      )}
      {...props}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {renderIcon()}
          <div>
            {finalEyebrow && <Eyebrow>{finalEyebrow}</Eyebrow>}
            <Title>{title}</Title>
          </div>
        </div>
        {description && (
          <TypographyP dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </div>
      {props.children && <div>{props.children}</div>}
    </div>
  );
}

export type TLayoutHeader = {
  breadcrumbs?: React.ReactNode;
  contentHeader?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function LayoutHeader({
  className,
  breadcrumbs,
  contentHeader,
  ...props
}: TLayoutHeader) {
  return (
    <div
      className={cn('bg-background', className)}
      data-layout="header"
      {...props}
    >
      <div className="container">
        {breadcrumbs}
        <div className="">{contentHeader}</div>
      </div>
      <Separator />
    </div>
  );
}

export type TLayoutGrid = React.HTMLAttributes<HTMLDivElement> & {
  withPaddingTop?: boolean;
  withPaddingBottom?: boolean;
  withContainer?: boolean;
};

export function LayoutGrid({
  className,
  withPaddingTop = true,
  withPaddingBottom = true,
  withContainer = true,
  ...props
}: TLayoutGrid) {
  return (
    <div
      className={cn(
        {
          'pt-8 md:pt-12': withPaddingTop,
          'pb-8 md:pb-12': withPaddingBottom,
        },
        className
      )}
      data-layout="grid"
    >
      <div
        className={cn({
          container: withContainer,
        })}
      >
        <div className={cn('grid grid-cols-12 gap-4')} {...props} />
      </div>
    </div>
  );
}
