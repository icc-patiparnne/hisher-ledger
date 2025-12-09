import { PaymentStatus } from '@platform/sdks/formance/src/models/components/paymentstatus';
import { PaymentType } from '@platform/sdks/formance/src/models/components/paymenttype';
import { V3PaymentStatusEnum } from '@platform/sdks/formance/src/models/components/v3paymentstatusenum';
import { V3PaymentTypeEnum } from '@platform/sdks/formance/src/models/components/v3paymenttypeenum';
import {
  ArrowDownRight,
  ArrowLeftRight,
  CircleCheck,
  CircleDotDashed,
  CircleX,
} from 'lucide-react';
import {
  CONNECTIVITY_PAYMENTS_SCHEME,
  TConnectivityPaymentsScheme,
  TRANSFER_INITIATION_STATUS,
  TRANSFER_INITIATION_TYPE,
  TTransferInitiationType,
} from '../../utils/sdk/payments/constants';
import { NormalizedTransferInitiationStatusModel } from '../../utils/sdk/payments/models';

// URL IDS
export const CONNECTIVITY_PAYMENTS_LIST = 'connectivity_payments_list';

export const CONNECTIVITY_ACCOUNTS_LIST = 'connectivity_accounts_list';
export const CONNECTIVITY_ACCOUNTS_LIST_FAVORITES = `connectivity_accounts_favorites`;

export const CONNECTIVITY_ACCOUNT_BALANCES_LIST =
  'connectivity_account_balances_list';

export const CONNECTIVITY_CASH_POOLS_LIST = 'connectivity_cash_pools_list';

export const CONNECTIVITY_TRANSFER_INITIATIONS_LIST =
  'connectivity_transfer_initiations_list';

export const CONNECTIVITY_BANK_ACCOUNTS_LIST =
  'connectivity_bank_accounts_list';

export const CONNECTIVITY_CONNECTORS_LIST = 'connectivity_connectors_list';

export const CONNECTIVITY_CONNECTORS_TASKS_LIST =
  'connectivity_connectors_tasks_list';
export const CONNECTIVITY_CONNECTORS_TASKS_INSTANCES_LIST =
  'connectivity_connectors_tasks_instances_list';

// ACTIONS
export const CONNECTIVITY_ACTION_CREATE_CASH_POOL =
  'CONNECTIVITY_ACTION_CREATE_CASH_POOL';
export const CONNECTIVITY_ACTION_INSTALL_CONNECTOR =
  'CONNECTIVITY_ACTION_INSTALL_CONNECTOR';
export const CONNECTIVITY_ACTION_UNINSTALL_CONNECTOR =
  'CONNECTIVITY_ACTION_UNINSTALL_CONNECTOR';
export const CONNECTIVITY_ACTION_RESET_CONNECTOR =
  'CONNECTIVITY_ACTION_RESET_CONNECTOR';
export const CONNECTIVITY_ACTION_CREATE_TRANSFER =
  'CONNECTIVITY_ACTION_CREATE_TRANSFER';
export const CONNECTIVITY_ACTION_UPDATE_TRANSFER =
  'CONNECTIVITY_ACTION_UPDATE_TRANSFER';
export const CONNECTIVITY_ACTION_CREATE_BANK_ACCOUNT =
  'CONNECTIVITY_ACTION_CREATE_BANK_ACCOUNT';

export const CONNECTIVITY_PAYMENT_TYPE_V1_MAP: Record<PaymentType, string> = {
  [PaymentType.PayIn]: 'Pay In',
  [PaymentType.Payout]: 'Payout',
  [PaymentType.Transfer]: 'Transfer',
  [PaymentType.Other]: 'Other',
};

export const CONNECTIVITY_PAYMENT_TYPE_V3_MAP: Record<
  V3PaymentTypeEnum,
  string
> = {
  [V3PaymentTypeEnum.Unknown]: 'Unknown',
  [V3PaymentTypeEnum.PayIn]: 'Pay In',
  [V3PaymentTypeEnum.Payout]: 'Payout',
  [V3PaymentTypeEnum.Transfer]: 'Transfer',
  [V3PaymentTypeEnum.Other]: 'Other',
};

export const CONNECTIVITY_PAYMENT_STATUS_V1_MAP: Record<PaymentStatus, string> =
  {
    [PaymentStatus.Pending]: 'Pending',
    [PaymentStatus.Succeeded]: 'Succeeded',
    [PaymentStatus.Cancelled]: 'Cancelled',
    [PaymentStatus.Failed]: 'Failed',
    [PaymentStatus.Expired]: 'Expired',
    [PaymentStatus.Refunded]: 'Refunded',
    [PaymentStatus.RefundedFailure]: 'Refunded Failure',
    [PaymentStatus.Dispute]: 'Dispute',
    [PaymentStatus.DisputeWon]: 'Dispute Won',
    [PaymentStatus.DisputeLost]: 'Dispute Lost',
    [PaymentStatus.Other]: 'Other',
  };

export const CONNECTIVITY_PAYMENT_STATUS_V3_MAP: Record<
  V3PaymentStatusEnum,
  string
> = {
  [V3PaymentStatusEnum.Unknown]: 'Unknown',
  [V3PaymentStatusEnum.Pending]: 'Pending',
  [V3PaymentStatusEnum.Succeeded]: 'Succeeded',
  [V3PaymentStatusEnum.Cancelled]: 'Cancelled',
  [V3PaymentStatusEnum.Failed]: 'Failed',
  [V3PaymentStatusEnum.Expired]: 'Expired',
  [V3PaymentStatusEnum.Refunded]: 'Refunded',
  [V3PaymentStatusEnum.RefundedFailure]: 'Refunded Failure',
  [V3PaymentStatusEnum.RefundReversed]: 'Refund Reversed',
  [V3PaymentStatusEnum.Dispute]: 'Dispute',
  [V3PaymentStatusEnum.DisputeWon]: 'Dispute Won',
  [V3PaymentStatusEnum.DisputeLost]: 'Dispute Lost',
  [V3PaymentStatusEnum.AmountAdjustement]: 'Amount Adjustment',
  [V3PaymentStatusEnum.Authorisation]: 'Authorisation',
  [V3PaymentStatusEnum.Capture]: 'Capture',
  [V3PaymentStatusEnum.CaptureFailed]: 'Capture Failed',
  [V3PaymentStatusEnum.Other]: 'Other',
};

export const CONNECTIVITY_PAYMENT_SCHEME_MAP: Record<
  TConnectivityPaymentsScheme,
  string
> = {
  [CONNECTIVITY_PAYMENTS_SCHEME.unknown]: 'Unknown',
  [CONNECTIVITY_PAYMENTS_SCHEME.other]: 'Other',
  [CONNECTIVITY_PAYMENTS_SCHEME.visa]: 'Visa',
  [CONNECTIVITY_PAYMENTS_SCHEME.mastercard]: 'Mastercard',
  [CONNECTIVITY_PAYMENTS_SCHEME.amex]: 'American Express',
  [CONNECTIVITY_PAYMENTS_SCHEME.diners]: 'Diners Club',
  [CONNECTIVITY_PAYMENTS_SCHEME.discover]: 'Discover',
  [CONNECTIVITY_PAYMENTS_SCHEME.jcb]: 'JCB',
  [CONNECTIVITY_PAYMENTS_SCHEME.unionpay]: 'UnionPay',
  [CONNECTIVITY_PAYMENTS_SCHEME.alipay]: 'Alipay',
  [CONNECTIVITY_PAYMENTS_SCHEME.cup]: 'China UnionPay',
  [CONNECTIVITY_PAYMENTS_SCHEME['sepa debit']]: 'SEPA Debit',
  [CONNECTIVITY_PAYMENTS_SCHEME['sepa credit']]: 'SEPA Credit',
  [CONNECTIVITY_PAYMENTS_SCHEME.sepa]: 'SEPA',
  [CONNECTIVITY_PAYMENTS_SCHEME['apple pay']]: 'Apple Pay',
  [CONNECTIVITY_PAYMENTS_SCHEME['google pay']]: 'Google Pay',
  [CONNECTIVITY_PAYMENTS_SCHEME.doku]: 'Doku',
  [CONNECTIVITY_PAYMENTS_SCHEME.dragonpay]: 'Dragonpay',
  [CONNECTIVITY_PAYMENTS_SCHEME.maestro]: 'Maestro',
  [CONNECTIVITY_PAYMENTS_SCHEME.molpay]: 'Molpay',
  [CONNECTIVITY_PAYMENTS_SCHEME.a2a]: 'A2A',
  [CONNECTIVITY_PAYMENTS_SCHEME['ach debit']]: 'ACH Debit',
  [CONNECTIVITY_PAYMENTS_SCHEME.ach]: 'ACH',
  [CONNECTIVITY_PAYMENTS_SCHEME.rtp]: 'RTP',
};

export const TRANSFER_INITIATION_STATUS_MAP: Record<
  NormalizedTransferInitiationStatusModel,
  string
> = {
  [TRANSFER_INITIATION_STATUS.WaitingForValidation]: 'Waiting for Validation',
  [TRANSFER_INITIATION_STATUS.Processing]: 'Processing',
  [TRANSFER_INITIATION_STATUS.Processed]: 'Processed',
  [TRANSFER_INITIATION_STATUS.Failed]: 'Failed',
  [TRANSFER_INITIATION_STATUS.Rejected]: 'Rejected',
  [TRANSFER_INITIATION_STATUS.Validated]: 'Validated',
  [TRANSFER_INITIATION_STATUS.Unknown]: 'Unknown',
  [TRANSFER_INITIATION_STATUS.ScheduledForProcessing]:
    'Scheduled for Processing',
  [TRANSFER_INITIATION_STATUS.AskRetried]: 'Ask Retried',
  [TRANSFER_INITIATION_STATUS.AskReversed]: 'Ask Reversed',
  [TRANSFER_INITIATION_STATUS.ReverseProcessing]: 'Reverse Processing',
  [TRANSFER_INITIATION_STATUS.ReverseFailed]: 'Reverse Failed',
  [TRANSFER_INITIATION_STATUS.PartiallyReversed]: 'Partially Reversed',
  [TRANSFER_INITIATION_STATUS.Reversed]: 'Reversed',
};

export const TRANSFER_INITIATION_STATUS_TO_COLOR: Record<
  NormalizedTransferInitiationStatusModel,
  string
> = {
  [TRANSFER_INITIATION_STATUS.WaitingForValidation]: 'text-yellow-500',
  [TRANSFER_INITIATION_STATUS.Processing]: 'text-blue-500',
  [TRANSFER_INITIATION_STATUS.Processed]: 'text-green-500',
  [TRANSFER_INITIATION_STATUS.Failed]: 'text-red-500',
  [TRANSFER_INITIATION_STATUS.Rejected]: 'text-red-500',
  [TRANSFER_INITIATION_STATUS.Validated]: 'text-green-500',
  [TRANSFER_INITIATION_STATUS.Unknown]: 'text-gray-500',
  [TRANSFER_INITIATION_STATUS.ScheduledForProcessing]: 'text-yellow-500',
  [TRANSFER_INITIATION_STATUS.AskRetried]: 'text-yellow-500',
  [TRANSFER_INITIATION_STATUS.AskReversed]: 'text-yellow-500',
  [TRANSFER_INITIATION_STATUS.ReverseProcessing]: 'text-yellow-500',
  [TRANSFER_INITIATION_STATUS.ReverseFailed]: 'text-red-500',
  [TRANSFER_INITIATION_STATUS.PartiallyReversed]: 'text-yellow-500',
  [TRANSFER_INITIATION_STATUS.Reversed]: 'text-green-500',
};

export const TRANSFER_INITIATION_STATUS_TO_ICON: Record<
  NormalizedTransferInitiationStatusModel,
  React.ElementType
> = {
  [TRANSFER_INITIATION_STATUS.WaitingForValidation]: CircleDotDashed,
  [TRANSFER_INITIATION_STATUS.Processing]: CircleDotDashed,
  [TRANSFER_INITIATION_STATUS.Processed]: CircleCheck,
  [TRANSFER_INITIATION_STATUS.Failed]: CircleX,
  [TRANSFER_INITIATION_STATUS.Rejected]: CircleX,
  [TRANSFER_INITIATION_STATUS.Validated]: CircleCheck,
  [TRANSFER_INITIATION_STATUS.Unknown]: CircleDotDashed,
  [TRANSFER_INITIATION_STATUS.ScheduledForProcessing]: CircleDotDashed,
  [TRANSFER_INITIATION_STATUS.AskRetried]: CircleDotDashed,
  [TRANSFER_INITIATION_STATUS.AskReversed]: CircleDotDashed,
  [TRANSFER_INITIATION_STATUS.ReverseProcessing]: CircleDotDashed,
  [TRANSFER_INITIATION_STATUS.ReverseFailed]: CircleX,
  [TRANSFER_INITIATION_STATUS.PartiallyReversed]: CircleDotDashed,
  [TRANSFER_INITIATION_STATUS.Reversed]: CircleCheck,
};

export const TRANSFER_INITIATION_TYPE_TO_COLOR: Record<
  TTransferInitiationType,
  string
> = {
  [TRANSFER_INITIATION_TYPE.Transfer]: 'text-yellow-500',
  [TRANSFER_INITIATION_TYPE.Payout]: 'text-rose-500',
};

export const TRANSFER_INITIATION_TYPE_TO_ICON: Record<
  TTransferInitiationType,
  React.ElementType
> = {
  [TRANSFER_INITIATION_TYPE.Transfer]: ArrowLeftRight,
  [TRANSFER_INITIATION_TYPE.Payout]: ArrowDownRight,
};
