import { Eye, WalletMinimal } from 'lucide-react';
import React from 'react';

import {
  AppCard,
  Button,
  Chip,
  chipVariantFromType,
  ColumnDef,
  ConnectorIcon,
  DataTable,
} from '@platform/ui';

import { Connector } from '@platform/sdks/formance/src/models/components';
import { formatDate } from '@platform/utils';
import { Link } from 'react-router';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { ROUTES } from '../../../../utils/routes';
import { getConnectorsOptions } from '../../../../utils/sdk/payments/constants';
import {
  NormalizedBankAccountRelatedAccountsModel,
  NormalizedConnectorConfigsModel,
} from '../../../../utils/sdk/payments/models';

type TPaymentsListProps = {
  paymentBankAccountRelatedAccounts: NormalizedBankAccountRelatedAccountsModel[];
  version: string;
  connectorsConfig: NormalizedConnectorConfigsModel;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PaymentBankAccountRelatedAccountsList({
  paymentBankAccountRelatedAccounts,
  connectorsConfig,
  version,
  ...props
}: TPaymentsListProps) {
  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'payments-bank-account-related-accounts-list',
  });

  const columns: ColumnDef<NormalizedBankAccountRelatedAccountsModel>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['id']}
          label={row.original.id}
          copyMode="click"
        />
      ),
    },

    {
      header: 'Account ID',
      accessorKey: 'accountId',
      cell: ({ row }) => (
        <Link
          to={
            ROUTES({
              organizationId,
              stackId,
              region,
              paymentAccountId: row.original.accountID,
            })['CONNECTIVITY_ACCOUNT_DETAIL'].to
          }
        >
          <Chip {...chipVariantFromType['id']} label={row.original.accountID} />
        </Link>
      ),
    },

    {
      id: 'connectorId',
      header: 'Connector ID',
      accessorKey: 'connectorId',
      cell: ({ row }) => (
        <Chip
          {...chipVariantFromType['id']}
          label={row.original.connectorID || 'unknown'}
        />
      ),
    },

    {
      header: 'Provider',
      accessorKey: 'provider',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <ConnectorIcon name={row.original.provider as unknown as Connector} />
          <span className="font-medium capitalize">
            {row.original.provider?.toLowerCase()}
          </span>
        </div>
      ),
    },

    {
      header: 'Created At',
      accessorKey: 'Created At',
      cell: ({ row }) => (
        <span className="whitespace-nowrap select-all">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },

    {
      header: '',
      accessorKey: 'See Bank Account',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="text-right">
          <Link
            to={
              ROUTES({
                organizationId,
                stackId,
                region,
                paymentAccountId: row.original.accountID,
              })['CONNECTIVITY_ACCOUNT_DETAIL'].to
            }
          >
            <Button variant="zinc" size="icon-md">
              <Eye />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <AppCard
      title="Related Accounts"
      description="A list of all the related accounts"
      variant="lilac"
      appIcon={WalletMinimal}
      {...props}
    >
      <DataTable
        data={paymentBankAccountRelatedAccounts || []}
        columns={columns}
        displayPagination={false}
        initialState={{
          columnVisibility: {
            id: false,
            connectorId: false,
          },
        }}
        filtersConfig={[
          {
            title: 'Provider',
            column: 'provider',
            options: getConnectorsOptions(connectorsConfig),
          },
        ]}
      />
    </AppCard>
  );
}
