import { useState } from 'react';

interface UseSensitiveProps {
  value: string;
  visibleChars?: number;
}

interface UseSensitiveReturn {
  displayValue: string;
  isSensitive: boolean;
  toggleSensitive: () => void;
}

export function useSensitive({
  value,
  visibleChars = 5,
}: UseSensitiveProps): UseSensitiveReturn {
  const [isSensitive, setIsSensitive] = useState(true);

  const toggleSensitive = () => setIsSensitive((prev) => !prev);

  const displayValue = isSensitive
    ? `${value.slice(0, visibleChars)}${'*'.repeat(
        Math.max(0, value.length - visibleChars)
      )}`
    : value;

  return {
    displayValue,
    isSensitive,
    toggleSensitive,
  };
}
