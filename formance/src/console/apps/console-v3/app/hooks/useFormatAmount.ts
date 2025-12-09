import { useCallback, useEffect, useState } from 'react';

const FORMAT_STORAGE_KEY = 'shouldFormatAmount';

export function useFormatAmount() {
  const [shouldFormat, setShouldFormat] = useState<boolean>(() => {
    // Initialize from localStorage, default to true if not set
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem(FORMAT_STORAGE_KEY);

    return stored === null ? true : stored === 'true';
  });

  useEffect(() => {
    // Update localStorage when shouldFormat changes
    localStorage.setItem(FORMAT_STORAGE_KEY, String(shouldFormat));
  }, [shouldFormat]);

  const toggleFormat = useCallback(() => {
    setShouldFormat((prev) => !prev);
  }, []);

  return {
    shouldFormat,
    toggleFormat,
  };
}
