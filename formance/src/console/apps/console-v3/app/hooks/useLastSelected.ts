import { useLocalStorage } from '@uidotdev/usehooks';
import { useCallback } from 'react';
import { useRouteGuard } from './useRouteGuard';

export type TLastSelectedTypeMap = {
  'ledger.ledgers': string;
};

export type TLastSelectedKey = keyof TLastSelectedTypeMap;

export function useLastSelected<T extends TLastSelectedKey>(
  key?: T | undefined
) {
  const { organizationId, stackId } = useRouteGuard({
    componentName: 'useLastSelected',
  });

  const [lastSelected, setLastSelected] = useLocalStorage<
    TLastSelectedTypeMap[T] | null
  >(key ? `${organizationId}-${stackId}:last-selected-${key}` : 'placeholder');

  const saveLastSelected = useCallback(
    (name: TLastSelectedTypeMap[T]) => {
      if (key) {
        setLastSelected(name);
      }
    },
    [key, setLastSelected]
  );

  const clearLastSelected = useCallback(() => {
    if (key) {
      setLastSelected(null);
    }
  }, [key, setLastSelected]);

  if (!key) {
    return {
      lastSelected: null,
      saveLastSelected: () => {},
      clearLastSelected: () => {},
    };
  }

  type ReturnType = {
    lastSelected: TLastSelectedTypeMap[T] | null;
    saveLastSelected: (name: TLastSelectedTypeMap[T]) => void;
    clearLastSelected: () => void;
  };

  return {
    lastSelected,
    saveLastSelected,
    clearLastSelected,
  } as ReturnType;
}
