import { DefaultApi } from '@platform/sdks/membershipclient';
import { get } from 'lodash-es';
import { Authenticator } from '../oauth/authenticator.server';
import { SessionCookie, UserInfoOrg } from '../oauth/types';

export type OrganizationPickerItem = UserInfoOrg & {
  label: string;
  isOwner: boolean;
  value: string;
};

export const getUserOrganizationList = async (
  api: DefaultApi,
  authenticator: Authenticator,
  cookie: SessionCookie
) => {
  const organizationList = (await api.listOrganizations()).data.data;
  const user = await authenticator.getUserInfo(cookie.master_access_token);
  const userOrganizations: UserInfoOrg[] | undefined = get(user, 'org');

  if (userOrganizations && organizationList) {
    return userOrganizations?.map((uOrg) => {
      const org = organizationList.find((org) => uOrg.id === org.id);

      return {
        ...uOrg,
        isOwner: org ? org.ownerId === user?.sub : false,
      };
    });
  }

  return undefined;
};
