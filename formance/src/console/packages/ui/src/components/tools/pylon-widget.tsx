'use client';

import { useEffect } from 'react';

type TPylonWidgetProps = {
  appId?: string;
  email: string;
  name?: string;
  emailHash?: string;
  organizationId?: string;
  stackId?: string;
  region?: string;
};

// Define the dataLayer for TypeScript
declare global {
  interface Window {
    pylon: any;
    Pylon: any;
  }
}

export function PylonWidget({
  appId = '4d9136ed-ffce-4fd6-926a-e8e2b2b29bf6',
  email,
  name,
  emailHash,
  organizationId,
  stackId,
  region,
}: TPylonWidgetProps) {
  // Extract username from email if name is not available
  const displayName = name || email.split('@')[0];

  useEffect(() => {
    window.pylon = {
      chat_settings: {
        app_id: appId,
        email: email,
        name: displayName,
        ...(emailHash && { email_hash: emailHash }),
      },
    };

    if (window.Pylon) {
      window.Pylon?.('showChatBubble');

      window.Pylon?.('setNewIssueCustomFields', {
        organization_id: organizationId,
        stack_id: stackId,
        region: region,
      });
    }
  }, []);

  return null;
}
