import { useEffect, useRef, useState } from 'react';
import { useFetcher } from 'react-router';
import { toast } from 'sonner';

import { lowerCaseAllWordsExceptFirstLetter } from '@platform/utils';

type ActionResponse<TData = any> = {
  formAction: string;
  message: string;
  data?: TData;
};

export const FORM_ERROR = 'error';

export type ActionDataError = {
  type: typeof FORM_ERROR;
  message: string;
};

export type ActionType<T, D> = {
  type: T;
  data: D;
  message: string;
};

type UseActionOptions = {
  actionUrl: string;
  formAction: string;
  onSuccess?: (data: any) => void;
  onError?: (message: string) => void;
};

export function useAction<TData = any>({
  actionUrl,
  formAction,
  onSuccess,
  onError,
}: UseActionOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetcher = useFetcher<ActionResponse<TData>>();

  // Store latest callback refs to avoid effect re-runs
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  // Update refs with latest callbacks
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      if ('formAction' in fetcher.data && 'message' in fetcher.data) {
        if (fetcher.data.formAction === formAction) {
          toast.success(fetcher.data.message);
          if (onSuccessRef.current) {
            onSuccessRef.current(
              'data' in fetcher.data ? fetcher.data.data : undefined
            );
          }
        } else if (fetcher.data.formAction === FORM_ERROR) {
          const errorMessage = lowerCaseAllWordsExceptFirstLetter(
            fetcher.data.message
          );
          toast.error(errorMessage);
          onErrorRef.current?.(errorMessage);
        }
      }
      setIsSubmitting(false);
    }
  }, [fetcher.data, fetcher.state, formAction]); // ✅ Removed onSuccess, onError from deps

  const submit = (values: TData) => {
    setIsSubmitting(true);

    const json = {
      ...values,
      formAction,
    } as TData & { formAction: string };

    fetcher.submit(json, {
      method: 'post',
      action: actionUrl,
      encType: 'application/json',
    });
  };

  return { submit, isSubmitting };
}
