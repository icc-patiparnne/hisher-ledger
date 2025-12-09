import { Code } from 'lucide-react';

import { EXTERNAL_LINKS } from '@platform/utils';

import { Badge } from '../badge';
import { Button } from '../button';
import { Separator } from '../separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../sheet';
import { TypographySmall } from '../typography';

type TSnippetsSheetProps = {
  asRemixLink?: any;
} & React.PropsWithChildren;

export const SnippetsSheet = ({
  children,
  asRemixLink,
}: TSnippetsSheetProps) => {
  const Link = asRemixLink ?? 'a';

  return (
    <Sheet>
      <div className="h-8">
        <SheetTrigger asChild>
          <div className="flex items-center gap-2">
            <TypographySmall className="font-medium text-muted-foreground">
              Developers
            </TypographySmall>
            <Button variant="outline" size="icon-md">
              <Code />
            </Button>
          </div>
        </SheetTrigger>
      </div>

      <SheetContent
        className="lg:w-[700px] sm:max-w-none flex flex-col"
        side="right"
      >
        <SheetHeader>
          <Badge className="mb-1" variant="cobalt">
            Developers
          </Badge>
          <SheetTitle>Get started with fctl</SheetTitle>
          <SheetDescription>
            Code snippets to help you get started.
          </SheetDescription>
          <div className="flex gap-2 pt-2">
            <Link
              {...(asRemixLink
                ? { to: EXTERNAL_LINKS.DOCUMENTATION_INSTALL_FCTL.to }
                : { href: EXTERNAL_LINKS.DOCUMENTATION_INSTALL_FCTL.to })}
              target={EXTERNAL_LINKS.DOCUMENTATION_INSTALL_FCTL.target}
            >
              <Button variant="primary" size="sm">
                Install fctl
              </Button>
            </Link>
          </div>
        </SheetHeader>

        <Separator />

        <div className="overflow-y-scroll no-scrollbar p-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
};
