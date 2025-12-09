import { EXTERNAL_LINKS } from '@platform/utils';
import { cn } from '../../lib/utils';
import { FormanceIcon } from '../formance-logo';
import { ModeToggle, TTheme } from '../mode-toggle';
import { TypographySmall } from '../typography';
import { ButtonStatus } from './button-status';

type TFooterProps = {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
  isMicroStack: boolean;
  hasContainer?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function Footer({
  theme,
  setTheme,
  isMicroStack,
  className,
  hasContainer = true,
  ...props
}: TFooterProps) {
  return (
    <footer
      className={cn('bg-background border-t border-border mt-12', className)}
      {...props}
    >
      <div className={cn(hasContainer ? 'container' : 'px-8')}>
        <nav className="flex flex-col sm:flex-row items-center justify-between py-8">
          <div className="flex flex-col items-center sm:items-start gap-4">
            <div className="flex items-center gap-4">
              <FormanceIcon size="sm" />
              <div className="flex items-center font-medium text-muted-foreground gap-3">
                <a
                  className="hover:text-foreground"
                  {...EXTERNAL_LINKS.WEBSITE}
                  href={EXTERNAL_LINKS.WEBSITE.to}
                >
                  <TypographySmall>Website</TypographySmall>
                </a>
                <a
                  className="hover:text-foreground"
                  {...EXTERNAL_LINKS.DOCUMENTATION}
                  href={EXTERNAL_LINKS.DOCUMENTATION.to}
                >
                  <TypographySmall>Docs</TypographySmall>
                </a>
                <a
                  className="hover:text-foreground"
                  {...EXTERNAL_LINKS.WEBSITE_CONTACT_US}
                  href={EXTERNAL_LINKS.WEBSITE_CONTACT_US.to}
                >
                  <TypographySmall>Contact</TypographySmall>
                </a>
                <a
                  className="hover:text-foreground"
                  {...EXTERNAL_LINKS.COMMUNITY_HELP}
                  href={EXTERNAL_LINKS.COMMUNITY_HELP.to}
                >
                  <TypographySmall>Community Help</TypographySmall>
                </a>
                <a
                  className="hover:text-foreground"
                  {...EXTERNAL_LINKS.NUMSCRIPT_PLAYGROUND}
                  href={EXTERNAL_LINKS.NUMSCRIPT_PLAYGROUND.to}
                >
                  <TypographySmall>Numscript Playground</TypographySmall>
                </a>
              </div>
            </div>

            <span className="inline-block text-muted-foreground text-xs">
              © {new Date().getFullYear()}, Formance
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            {!isMicroStack && (
              <a {...EXTERNAL_LINKS.STATUS} href={EXTERNAL_LINKS.STATUS.to}>
                <ButtonStatus status="enabled">
                  <span>All systems normal</span>
                </ButtonStatus>
              </a>
            )}

            <ModeToggle
              theme={theme ?? 'light'}
              setTheme={setTheme as (theme: TTheme) => void}
            />
          </div>
        </nav>
      </div>
    </footer>
  );
}
