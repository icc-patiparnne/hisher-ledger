import { Status } from '@platform/sdks/formance/src/models/components';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@platform/ui';
import {
  ArrowUpRight,
  CircleDotDashed,
  Copy,
  MoreHorizontal,
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { copyToClipboardToast } from '../../../../utils/common';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedTransferInitiationModel } from '../../../../utils/sdk/payments/models';
import {
  TRANSFER_INITIATION_STATUS_MAP,
  TRANSFER_INITIATION_STATUS_TO_COLOR,
  TRANSFER_INITIATION_STATUS_TO_ICON,
} from '../../constants';

type TPaymentTransferActionProps = {
  transfer: NormalizedTransferInitiationModel;
  canUpdateStatus?: boolean;
  onUpdateTransferStatus?: (transferId: string, status: Status) => void;
  isUpdatingTransferStatus?: boolean;
};

export default function PaymentTransferActions({
  transfer,
  canUpdateStatus = false,
  onUpdateTransferStatus,
  isUpdatingTransferStatus,
}: TPaymentTransferActionProps) {
  const navigate = useNavigate();

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'payment-transfer-actions',
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-md">
          <span className="sr-only">Open transfer actions</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Copy className="mr-2 h-4 w-4" />
            <span className="mr-2 inline-block">Copy to Clipboard</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => {
                  copyToClipboardToast(
                    transfer.id,
                    'Transfer ID copied to clipboard'
                  );
                }}
              >
                Transfer ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  copyToClipboardToast(
                    transfer.connectorID,
                    'Connector ID copied to clipboard'
                  );
                }}
              >
                Connector ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  copyToClipboardToast(
                    transfer.sourceAccountID,
                    'Source Account ID copied to clipboard'
                  );
                }}
              >
                Source Account ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  copyToClipboardToast(
                    transfer.destinationAccountID,
                    'Destination Account ID copied to clipboard'
                  );
                }}
              >
                Destination Account ID
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            <span className="mr-2 inline-block">Go to</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => {
                  navigate(
                    ROUTES({
                      organizationId,
                      stackId,
                      region,
                      connectorId: transfer.connectorID,
                      provider: transfer?.provider || undefined,
                    })['CONNECTIVITY_CONNECTOR_INSTALLED_DETAIL'].to
                  );
                }}
              >
                Connector
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  navigate(
                    ROUTES({
                      organizationId,
                      stackId,
                      region,
                      paymentAccountId: transfer.sourceAccountID,
                    })['CONNECTIVITY_ACCOUNT_DETAIL'].to
                  );
                }}
              >
                Source Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate(
                    ROUTES({
                      organizationId,
                      stackId,
                      region,
                      paymentAccountId: transfer.destinationAccountID,
                    })['CONNECTIVITY_ACCOUNT_DETAIL'].to
                  );
                }}
              >
                Destination Account
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {onUpdateTransferStatus && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={!canUpdateStatus}>
                <CircleDotDashed className="mr-2 h-4 w-4" />
                <span className="mr-2 inline-block">Update Status</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {Object.values(Status).map((status) => {
                    const IconComponent =
                      TRANSFER_INITIATION_STATUS_TO_ICON[status];

                    return (
                      <DropdownMenuItem
                        key={status}
                        onClick={() =>
                          onUpdateTransferStatus(transfer.id, status)
                        }
                        disabled={isUpdatingTransferStatus}
                      >
                        <IconComponent
                          className={`mr-2 h-4 w-4 ${TRANSFER_INITIATION_STATUS_TO_COLOR[status]}`}
                        />
                        {TRANSFER_INITIATION_STATUS_MAP[status]}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
