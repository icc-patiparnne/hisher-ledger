import { cn } from '@platform/ui/lib/utils';
import { EXTERNAL_LINKS } from '@platform/utils';
import { Button } from '../button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../card';
import { Dialog, DialogContent } from '../dialog';
import { FormanceLogo } from '../formance-logo';
import ReactIcon from '../icons/react-icons';
import { Input } from '../input';
import { Label } from '../label';
import { TypographyH2 } from '../typography';

type TLoginFormProps = React.ComponentPropsWithoutRef<'div'> & {
  withLogo?: boolean;
  title?: string;
  description?: string;
  onLogin?: () => void | Promise<void>;
};

export function LoginForm({
  className,
  withLogo = true,
  title = 'Login to Formance',
  description = 'Login with your Google, Github, or Microsoft account',
  onLogin,
  ...props
}: TLoginFormProps) {
  const handleLogin = async () => {
    if (onLogin) {
      await onLogin();
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            <span className="sr-only">Formance</span>
            {withLogo ? <FormanceLogo /> : <TypographyH2>{title}</TypographyH2>}
          </CardTitle>
          {description && (
            <CardDescription className="pt-4">{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleLogin}
                >
                  <ReactIcon name="google" className="size-4" />
                  Login with Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleLogin}
                >
                  <ReactIcon name="github" className="size-4" />
                  Login with Github
                </Button>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleLogin}
                >
                  <ReactIcon name="microsoft" className="size-4" />
                  Login with Microsoft
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with SSO
                </span>
              </div>
              <div className="grid gap-3">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" />
                </div>
                <Button type="button" className="w-full" onClick={handleLogin}>
                  Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{' '}
        <a
          href={EXTERNAL_LINKS.TERMS_OF_SERVICE.to}
          target={EXTERNAL_LINKS.TERMS_OF_SERVICE.target}
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href={EXTERNAL_LINKS.PRIVACY_POLICY.to}
          target={EXTERNAL_LINKS.PRIVACY_POLICY.target}
        >
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}

type ControlledLoginDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin?: () => void | Promise<void>;
} & TLoginFormProps;

export function ControlledLoginDialog({
  open,
  onOpenChange,
  onLogin,
  ...props
}: ControlledLoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <LoginForm withLogo={false} {...props} onLogin={onLogin} />
      </DialogContent>
    </Dialog>
  );
}
