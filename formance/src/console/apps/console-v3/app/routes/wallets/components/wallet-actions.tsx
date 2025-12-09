import { GetWalletSummaryResponse } from '@platform/sdks/formance/src/models/components';
import { useParams } from 'react-router';
import React from 'react';
import WalletActionsCreditWallet from './wallet-actions-credit-wallet';
import WalletActionsDebitWallet from './wallet-actions-debit-wallet';

export default function WalletsActions({
  walletBalances,
  isHoldsList = false,
}: {
  walletBalances: GetWalletSummaryResponse['data']['balances'];
  isHoldsList?: boolean;
}) {
  const { walletId } = useParams();

  if (!walletId) {
    return <div>No wallet ID</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <WalletActionsCreditWallet
        walletId={walletId}
        walletBalances={walletBalances}
      />
      <WalletActionsDebitWallet
        walletId={walletId}
        walletBalances={walletBalances}
        isCreatingHold={isHoldsList}
      />
    </div>
  );
}
