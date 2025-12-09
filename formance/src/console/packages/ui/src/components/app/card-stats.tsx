import { LucideIcon } from 'lucide-react';
import { Button } from '../button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../card';

type CardStatsProps = {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  footer?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const CardStats = ({
  children,
  title,
  icon,
  footer,
  ...props
}: CardStatsProps) => {
  const Icon = icon;

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="emerald" size="icon-md" notClickable>
              <Icon className="h-4 w-4" />
            </Button>
            <span>{title}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{children}</div>
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};
