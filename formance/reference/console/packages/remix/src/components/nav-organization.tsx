import { Link } from 'react-router';

import {
  Badge,
  buttonVariants,
  Chip,
  chipVariantFromType,
  CONTEXT_TYPES,
  ContextIcon,
  FormanceIcon,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SeparatorVertical,
} from '@platform/ui';

import { Stack } from '@platform/sdks';
import { OrganizationPickerItem, UserInfoOrg } from '../utils';

export type StackPickerItem = Stack & {
  label: string;
  value: string;
};

type TNavOrganizationProps = {
  logoLink?: string;
  logoOnClick?: () => void;
  organizations: UserInfoOrg[];
  organizationId: string;
  organizationLink: string;
  stackId?: string;
  stackLink?: string;
  stacks?: StackPickerItem[];
  onOrganizationChange?: (
    organizationId: string,
    organizationName: string
  ) => void | undefined;
  onStackChange?: (stackId: string, _stackName: string) => void | undefined;
};

export function NavOrganization({
  logoLink,
  logoOnClick,
  organizations,
  organizationId,
  organizationLink,
  stackId,
  stackLink,
  stacks,
  onOrganizationChange,
  onStackChange,
}: TNavOrganizationProps) {
  const orgs: OrganizationPickerItem[] | [] =
    organizations?.map((org: UserInfoOrg) => ({
      ...org,
      label: org.name,
      value: org.id,
      isOwner: org.isOwner,
    })) || [];

  // Find current organization for display
  const currentOrganization = orgs.find((org) => org.id === organizationId);

  return (
    <div id="nav-organization" className="flex items-center">
      {logoLink ? (
        <Link to={logoLink}>
          <FormanceIcon size="sm" />
        </Link>
      ) : (
        <FormanceIcon
          onClick={logoOnClick}
          size="sm"
          className="cursor-pointer"
        />
      )}

      <SeparatorVertical className="mx-1" />

      <div className="flex items-center gap-1">
        <Link to={organizationLink ?? ''} className="flex items-center gap-2">
          <Chip
            label={
              currentOrganization
                ? `${currentOrganization.name} - ${currentOrganization.id}`
                : organizationId ?? ''
            }
            copyValue={organizationId}
            {...chipVariantFromType['organizationId']}
          />
        </Link>

        {orgs && orgs.length > 0 && (
          <Select
            value={organizationId}
            onValueChange={async (value) => {
              // No localStorage saving here - only save when actually visiting/navigating
              const organization = organizations.find(
                (org) => org.id === value
              );
              if (organization && onOrganizationChange) {
                onOrganizationChange?.(organization.id, organization.name);
              }
            }}
          >
            <SelectTrigger
              size="sm"
              className={buttonVariants({
                variant: 'outline',
                size: 'icon-sm',
              })}
            />

            <SelectContent>
              <div
                id="nav-organization-content"
                className="px-2 pt-1 pb-2 font-semibold text-muted-foreground capitalize text-sm border-b border-border"
              >
                <div className="flex items-center gap-2">
                  <ContextIcon
                    type={CONTEXT_TYPES.ORGANIZATION}
                    size="icon-sm"
                  />
                  <span>Organizations</span>
                </div>
              </div>
              <SelectGroup>
                {organizations.map((organization) => (
                  <SelectItem
                    key={organization.id}
                    value={organization.id}
                    data-testid="organizations-picker-item"
                  >
                    <div className="flex justify-between gap-2 items-center flex-1 w-full">
                      <Chip
                        label={`${organization.name} - ${organization.id}`}
                        {...chipVariantFromType['organizationId']}
                        copyMode="none"
                      />

                      {organization.isOwner ? (
                        <Badge variant="emerald">Owner</Badge>
                      ) : (
                        <Badge variant="gold">Member</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>

      {stackId && stackLink && (
        <>
          <SeparatorVertical className="mx-1" />
          <div className="flex items-center gap-1">
            <Link className="font-medium" to={stackLink ?? ''}>
              <Chip label={stackId} {...chipVariantFromType['stackId']} />
            </Link>

            {stacks && stacks.length > 0 && (
              <Select
                value={stackId}
                onValueChange={async (value) => {
                  const stack = stacks.find((stack) => stack.id === value);
                  if (stack && onStackChange) {
                    onStackChange?.(stack.id, stack.name);
                  }
                }}
              >
                <SelectTrigger
                  size="sm"
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'icon-sm',
                  })}
                />

                <SelectContent>
                  <div
                    id="nav-stack-content"
                    className="px-2 pt-1 pb-2 font-semibold text-muted-foreground capitalize text-sm border-b border-border"
                  >
                    <div className="flex items-center gap-2">
                      <ContextIcon type={CONTEXT_TYPES.STACK} size="icon-sm" />
                      <span>Stacks</span>
                    </div>
                  </div>
                  <SelectGroup>
                    {stacks.map((stack) => (
                      <SelectItem
                        key={stack.id}
                        value={stack.id}
                        data-testid="stacks-picker-item"
                      >
                        <div className="flex justify-between gap-2 items-center flex-1 w-full">
                          <Chip
                            label={stack.label}
                            {...chipVariantFromType['stackId']}
                            copyMode="none"
                          />
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        </>
      )}
    </div>
  );
}
