import { EXTERNAL_LINKS } from '@platform/utils';
import { FormanceLogo } from '../formance-logo';
import { LoginForm } from './modal';

const loginImage = '/images/login.png';

export function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a
            href={EXTERNAL_LINKS.WEBSITE.to}
            target={EXTERNAL_LINKS.WEBSITE.target}
            className="flex items-center gap-2 font-medium"
          >
            <FormanceLogo />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm withLogo={false} />
          </div>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <img
          src={loginImage}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
