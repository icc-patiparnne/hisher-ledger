'use client';

import { AspectRatio as AspectRatioPrimitive } from 'radix-ui';
import * as React from 'react';

type AspectRatioProps = {
  ratio?: number;
  children?: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'className'>;

function AspectRatio(props: AspectRatioProps) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
