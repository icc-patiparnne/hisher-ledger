import {
  BookOpen,
  Code,
  Globe,
  KeyRound,
  MessageCircle,
  MoreHorizontal,
  Server,
  Webhook,
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';
import { useTheme } from 'remix-themes';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Header as HeaderUI,
  ModeToggle,
  NavTime,
  TTheme,
} from '@platform/ui';

import { usePortal } from '../hooks/usePortal';
import { CurrentContext } from '../root';

import { EXTERNAL_LINKS } from '@platform/utils';

import { NavOrganization, NavUser } from '@platform/remix';
import { useMicroStack } from '../hooks/useMicroStack';
import { TRouteParamsWithSearchParams } from '../types/routes';
import { ACTIONS_ROUTES } from '../utils/actions';
import { ROUTES } from '../utils/routes';
import AppGoTo from './app-go-to';

type THeaderProps = {
  context: CurrentContext;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Header({ context }: THeaderProps) {
  const { organizationId, stackId, region } = context;

  const { redirectToPortal } = usePortal({ organizationId, stackId });

  const { isMicroStack } = useMicroStack(context);

  const [theme, setTheme] = useTheme();

  return (
    <HeaderUI
      left={
        <NavOrganization
          logoOnClick={redirectToPortal}
          logoLink={
            isMicroStack
              ? ROUTES({
                  organizationId,
                  stackId,
                  region,
                })['GLOBAL_OVERVIEW'].to
              : undefined
          }
          organizations={context?.currentUser?.organizations || []}
          organizationId={organizationId}
          organizationLink={
            ROUTES({
              organizationId,
              stackId,
              region,
            })['GLOBAL_OVERVIEW'].to
          }
          stackId={stackId}
          stackLink={
            ROUTES({
              organizationId,
              stackId,
              region,
            })['GLOBAL_OVERVIEW'].to
          }
        />
      }
      center={<AppGoTo />}
      right={
        <div className="flex items-center gap-2">
          <NavTime />

          <NavUser
            currentUser={context?.currentUser}
            actionLogout={ACTIONS_ROUTES({})['AUTH_ACTION_LOGOUT'].to}
          />

          <ModeToggle
            theme={theme ?? 'light'}
            setTheme={setTheme as (theme: TTheme) => void}
          />

          <NavOptions
            organizationId={organizationId}
            stackId={stackId}
            region={region}
            context={context}
          />
        </div>
      }
    />
  );
}

type TNavOptionsProps = Pick<
  TRouteParamsWithSearchParams,
  'organizationId' | 'stackId' | 'region'
> & {
  context: CurrentContext;
};

function NavOptions({
  organizationId,
  stackId,
  region,
  context,
}: TNavOptionsProps) {
  const { redirectToPortal } = usePortal({ organizationId, stackId });
  const { isMicroStack } = useMicroStack(context);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-md">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>

        <DropdownMenuGroup>
          {!isMicroStack && (
            <>
              <DropdownMenuItem asChild>
                <Link
                  to={
                    ROUTES({ organizationId, stackId, region })
                      .OAUTH_CLIENTS_OVERVIEW.to
                  }
                >
                  <KeyRound />
                  OAuth Clients
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  to={
                    ROUTES({ organizationId, stackId, region })
                      .WEBHOOKS_OVERVIEW.to
                  }
                >
                  <Webhook />
                  Webhooks
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link
            to={EXTERNAL_LINKS.WEBSITE.to}
            target={EXTERNAL_LINKS.WEBSITE.target}
          >
            <DropdownMenuItem>
              <Globe />
              Website
            </DropdownMenuItem>
          </Link>

          <Link
            to={EXTERNAL_LINKS.COMMUNITY_HELP.to}
            target={EXTERNAL_LINKS.COMMUNITY_HELP.target}
          >
            <DropdownMenuItem>
              <MessageCircle />
              Community Help
            </DropdownMenuItem>
          </Link>

          <Link
            to={EXTERNAL_LINKS.DOCUMENTATION.to}
            target={EXTERNAL_LINKS.DOCUMENTATION.target}
          >
            <DropdownMenuItem>
              <BookOpen />
              Documentation
            </DropdownMenuItem>
          </Link>

          <Link
            to={EXTERNAL_LINKS.DOCUMENTATION_API.to}
            target={EXTERNAL_LINKS.DOCUMENTATION_API.target}
          >
            <DropdownMenuItem>
              <Server />
              API
            </DropdownMenuItem>
          </Link>

          <Link
            to={EXTERNAL_LINKS.NUMSCRIPT_PLAYGROUND.to}
            target={EXTERNAL_LINKS.NUMSCRIPT_PLAYGROUND.target}
          >
            <DropdownMenuItem>
              <Code />
              Numscript Playground
            </DropdownMenuItem>
          </Link>

          {!isMicroStack && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={redirectToPortal}
                  formTarget="_blank"
                >
                  Go to Portal
                </Button>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
