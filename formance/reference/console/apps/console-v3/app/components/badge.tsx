import { TBadgeProps } from '@platform/ui';
import { NormalizedMigrationInfoModel } from '../utils/sdk/ledger/models';
import {
  NormalizedConnectorTaskModel,
  NormalizedPaymentAccountModel,
  NormalizedPaymentModel,
  NormalizedTransferInitiationModel,
} from '../utils/sdk/payments/models';
import { NormalizedReconciliationModel } from '../utils/sdk/reconciliation/models';

const badgeVariantFromMigrationState: Record<
  NonNullable<NormalizedMigrationInfoModel['state']> | '',
  TBadgeProps['variant']
> = {
  'TO DO': 'amber',
  DONE: 'green',
  PROGRESS: 'amber',
  '': 'zinc',
};

const badgeVariantFromPaymentType: Record<
  NormalizedPaymentModel['type'],
  TBadgeProps['variant']
> = {
  'PAY-IN': 'sky',
  PAYOUT: 'rose',
  TRANSFER: 'yellow',
  OTHER: 'zinc',
  UNKNOWN: 'zinc',
};

const badgeVariantFromPaymentStatus: Record<
  NormalizedPaymentModel['status'],
  TBadgeProps['variant']
> = {
  PENDING: 'warning',
  SUCCEEDED: 'valid',
  CANCELLED: 'rose',
  FAILED: 'destructive',
  EXPIRED: 'destructive',
  REFUND_REVERSED: 'valid',
  REFUNDED: 'teal',
  REFUNDED_FAILURE: 'destructive',
  DISPUTE: 'warning',
  DISPUTE_WON: 'valid',
  DISPUTE_LOST: 'destructive',
  AMOUNT_ADJUSTEMENT: 'zinc',
  AUTHORISATION: 'info',
  CAPTURE: 'indigo',
  CAPTURE_FAILED: 'destructive',
  OTHER: 'zinc',
  UNKNOWN: 'zinc',
};

const badgeVariantFromReportStatus: Record<
  NormalizedReconciliationModel['status'],
  TBadgeProps['variant']
> = {
  OK: 'valid',
  NOT_OK: 'destructive',
  PENDING: 'warning',
  SUCCEEDED: 'valid',
  CANCELLED: 'rose',
  FAILED: 'destructive',
  OTHER: 'zinc',
  UNKNOWN: 'zinc',
};

const badgeVariantFromPaymentAccountType: Record<
  NormalizedPaymentAccountModel['type'],
  TBadgeProps['variant']
> = {
  UNKNOWN: 'zinc',
  INTERNAL: 'teal',
  EXTERNAL: 'cyan',
};

const badgeVariantFromTransferStatus: Record<
  NormalizedTransferInitiationModel['status'],
  TBadgeProps['variant']
> = {
  WAITING_FOR_VALIDATION: 'warning',
  SCHEDULED_FOR_PROCESSING: 'amber',
  PROCESSING: 'warning',
  PROCESSED: 'valid',
  FAILED: 'destructive',
  REJECTED: 'destructive',
  VALIDATED: 'valid',
  ASK_RETRIED: 'warning',
  ASK_REVERSED: 'info',
  REVERSE_PROCESSING: 'warning',
  REVERSE_FAILED: 'destructive',
  PARTIALLY_REVERSED: 'rose',
  REVERSED: 'valid',
  UNKNOWN: 'zinc',
};

const badgeVariantFromTransferType: Record<
  NormalizedTransferInitiationModel['type'],
  TBadgeProps['variant']
> = {
  PAYOUT: 'cyan',
  TRANSFER: 'yellow',
};
const badgeVariantFromTaskStatus: Record<
  NonNullable<NormalizedConnectorTaskModel['status']>,
  TBadgeProps['variant']
> = {
  PENDING: 'warning',
  ACTIVE: 'valid',
  STOPPED: 'rose',
  TERMINATED: 'sky',
  FAILED: 'destructive',
};

const badgeVariantFromFlowsInstanceStatus: Record<
  'IN_PROGRESS' | 'TERMINATED',
  TBadgeProps['variant']
> = {
  IN_PROGRESS: 'valid',
  TERMINATED: 'sky',
};

const badgeVariantFromWebhookStatus: Record<
  'ACTIVE' | 'DISABLED',
  TBadgeProps['variant']
> = {
  ACTIVE: 'valid',
  DISABLED: 'rose',
};

export {
  badgeVariantFromFlowsInstanceStatus,
  badgeVariantFromMigrationState,
  badgeVariantFromPaymentAccountType,
  badgeVariantFromPaymentStatus,
  badgeVariantFromPaymentType,
  badgeVariantFromReportStatus,
  badgeVariantFromTaskStatus,
  badgeVariantFromTransferStatus,
  badgeVariantFromTransferType,
  badgeVariantFromWebhookStatus,
};
