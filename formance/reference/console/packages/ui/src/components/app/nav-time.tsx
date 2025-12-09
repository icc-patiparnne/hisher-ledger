'use client';

import { useEffect, useState } from 'react';

import { formatDate } from '@platform/utils';
import { TypographySmall } from '../typography';

export function NavTime() {
  const [time, setTime] = useState<string>();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatDate(new Date()));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="hidden font-medium text-muted-foreground md:inline-block whitespace-nowrap">
      <TypographySmall>{time}</TypographySmall>
    </div>
  );
}
