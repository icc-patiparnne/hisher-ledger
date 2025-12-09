import { CurrentContext } from '../root';

export function useMicroStack(context: CurrentContext) {
  const isMicroStack = context.isMicroStack;

  return {
    isMicroStack,
  };
}
