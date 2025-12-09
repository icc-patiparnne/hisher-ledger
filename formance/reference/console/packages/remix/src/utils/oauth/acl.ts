import { Role } from '@platform/sdks';
import { CurrentUser } from './types';

export type UserCan = {
  canRead: boolean;
  canWrite: boolean;
};

export type UserAbility = {
  organization: UserCan & {
    getAbilityByOrg?: (organizationId: string) => UserCan;
  };
  stack: UserCan & {
    getAbilityByStack?: (stackId: string) => UserCan;
  };
};

export const handleAcl = (
  currentUser?: CurrentUser,
  isMicroStack?: boolean
): UserAbility => {
  if (isMicroStack) {
    return {
      organization: {
        canRead: true,
        canWrite: true,
        getAbilityByOrg: () => ({
          canRead: true,
          canWrite: true,
        }),
      },
      stack: {
        canRead: true,
        canWrite: true,
      },
    };
  }

  if (currentUser) {
    const organizationRole = currentUser.currentOrg?.role;
    const stackRole = currentUser.currentStack?.role;

    const canReadOrg =
      organizationRole === Role.Admin || organizationRole === Role.Guest;
    const canWriteOrg = organizationRole === Role.Admin;

    const canReadStack = stackRole === Role.Admin || stackRole === Role.Guest;
    const canWriteStack = stackRole === Role.Admin;

    return {
      organization: {
        canRead: canReadOrg,
        canWrite: canWriteOrg,
        getAbilityByOrg: (organizationId: string) => {
          const org = currentUser?.organizations.find(
            (o) => o.id === organizationId
          );
          if (org && org.role) {
            return {
              canRead: org.role === Role.Admin || org.role === Role.Guest,
              canWrite: org.role === Role.Admin,
            };
          }

          return {
            canRead: false,
            canWrite: false,
          };
        },
      },
      stack: {
        canRead: canReadStack,
        canWrite: canWriteStack,
      },
    };
  }

  return {
    organization: {
      canRead: false,
      canWrite: false,
      getAbilityByOrg: () => ({
        canRead: false,
        canWrite: false,
      }),
    },
    stack: {
      canRead: false,
      canWrite: false,
    },
  };
};
