import React from 'react';
import { NormalizedWalletExpandedHoldModel } from '../../../utils/sdk/wallets/models';
import WalletHoldsConfirmAction from './wallet-holds-actions-confirm';
import WalletHoldsVoidAction from './wallet-holds-actions-void';

type TWalletHoldsActionsProps = {
  hold: NormalizedWalletExpandedHoldModel;
};

export default function WalletHoldsActions({ hold }: TWalletHoldsActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <WalletHoldsConfirmAction hold={hold} />
      <WalletHoldsVoidAction hold={hold} />
    </div>
  );
}
