import { LucideIcon, SquareMinus } from 'lucide-react';
import { Button, TButtonProps } from '../button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../card';
import { TypographyH4, TypographyP } from '../typography';

type TAppCardProps = {
  title?: string;
  description?: string;
  variant?: TButtonProps['variant'];
  appIcon?: LucideIcon;
  footer?: React.ReactNode;
} & React.ComponentProps<typeof Card>;

export function AppCard({
  title,
  description,
  appIcon,
  variant,
  children,
  footer,
  ...CardProps
}: TAppCardProps) {
  const Icon = appIcon;

  return (
    <Card {...CardProps}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            {Icon && (
              <Button variant={variant} size="icon-md" notClickable>
                <Icon />
              </Button>
            )}
            {title}
          </div>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer}
    </Card>
  );
}

export function AppCardEmpty({
  title,
  description,
  children,
  ...props
}: Omit<TAppCardProps, 'appIcon'>) {
  return (
    <Card {...props}>
      <CardContent className="text-center">
        <Button variant="outline" size="icon-xl">
          <SquareMinus className="opacity-80" />
        </Button>
        <TypographyH4 className="pt-3 pb-1">{title}</TypographyH4>
        <TypographyP className="max-w-lg mx-auto">{description}</TypographyP>
        <div className="flex justify-center gap-2 pt-3">{children}</div>
      </CardContent>
    </Card>
  );
}
