import { Form } from 'react-router';

import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@platform/ui';

import { CurrentUser } from '../utils';

export function NavUser({
  currentUser,
  actionLogout,
}: {
  currentUser: CurrentUser | undefined;
  actionLogout: string;
}) {
  if (!currentUser) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full"
          data-testid="preferences"
        >
          <Avatar>
            <AvatarFallback className="capitalize">
              {currentUser?.email?.split('@')[0]?.[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {currentUser && (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {currentUser?.email?.split('@')[0]}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem>
          <Form className="w-full" method="post" action={actionLogout}>
            <button
              className="text-left w-full"
              data-testid="logout"
              type="submit"
            >
              Sign out
            </button>
          </Form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
