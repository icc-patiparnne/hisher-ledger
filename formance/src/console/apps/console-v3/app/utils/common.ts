import { get } from 'lodash-es';
import { toast } from 'sonner';

export const copyToClipboardToast = (value: string, message?: string) => {
  navigator.clipboard.writeText(value);
  toast.success(message || 'Copied to clipboard');
};

export const getDiffBetweenObjects = (
  obj1: any,
  obj2: any
): {
  added: { key: string; value: any }[];
  removed: { key: string; value: any }[];
} => {
  const added = Object.entries(obj2)
    .filter(([key, value]) => !get(obj1, key) || get(obj1, key) !== value)
    .map(([key, value]) => ({ key, value }));

  const removed = Object.entries(obj1)
    .filter(([key, value]) => !get(obj2, key) || get(obj2, key) !== value)
    .map(([key, value]) => ({ key, value }));

  return { added, removed };
};
