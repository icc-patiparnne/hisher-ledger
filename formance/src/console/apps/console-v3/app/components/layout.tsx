import React from 'react';

import { LayoutHeader, TLayoutHeader } from '@platform/ui';

export function LayoutHeaderConsole({ className, ...props }: TLayoutHeader) {
  return <LayoutHeader className="mb-2 -mt-2" {...props} />;
}
