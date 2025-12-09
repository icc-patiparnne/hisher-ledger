import { useOutletContext } from 'react-router';

import { handleAcl, UserAbility } from '@platform/remix';
import { CurrentContext } from '../root';

export default function useAbility(): UserAbility {
  const {
    currentUser,
    env: { MICRO_STACK },
  } = useOutletContext<CurrentContext>();
  const isMicroStack = MICRO_STACK === '1';

  const ability = handleAcl(currentUser, isMicroStack);

  return ability;
}
