import {
  PaymentScheme,
  TransferInitiationType,
} from '@platform/sdks/formance/src/models/components';
import { NormalizedConnectorConfigsModel } from './models';

export const getConnectorsOptions = (
  connectors?: NormalizedConnectorConfigsModel | undefined
) =>
  connectors
    ? Object.entries(connectors).map(([key, connector]) => {
        const nameValue = connector.name?.defaultValue || key;

        return {
          label: nameValue.toLowerCase(),
          value: nameValue.toUpperCase(),
        };
      })
    : [];

export const CONNECTIVITY_PAYMENTS_SCHEME: Record<PaymentScheme, string> = {
  [PaymentScheme.Unknown]: 'UNKNOWN',
  [PaymentScheme.Other]: 'OTHER',
  [PaymentScheme.Visa]: 'VISA',
  [PaymentScheme.Mastercard]: 'MASTERCARD',
  [PaymentScheme.Amex]: 'AMERICAN_EXPRESS',
  [PaymentScheme.Diners]: 'DINERS_CLUB',
  [PaymentScheme.Discover]: 'DISCOVER',
  [PaymentScheme.Jcb]: 'JCB',
  [PaymentScheme.Unionpay]: 'UNIONPAY',
  [PaymentScheme.Alipay]: 'ALIPAY',
  [PaymentScheme.Cup]: 'CHINA_UNIONPAY',
  [PaymentScheme.SepaDebit]: 'SEPA_DEBIT',
  [PaymentScheme.SepaCredit]: 'SEPA_CREDIT',
  [PaymentScheme.Sepa]: 'SEPA',
  [PaymentScheme.ApplePay]: 'APPLE_PAY',
  [PaymentScheme.GooglePay]: 'GOOGLE_PAY',
  [PaymentScheme.Doku]: 'DOKU',
  [PaymentScheme.Dragonpay]: 'DRAGONPAY',
  [PaymentScheme.Maestro]: 'MAESTRO',
  [PaymentScheme.Molpay]: 'MOLPAY',
  [PaymentScheme.A2a]: 'A2A',
  [PaymentScheme.AchDebit]: 'ACH_DEBIT',
  [PaymentScheme.Ach]: 'ACH',
  [PaymentScheme.Rtp]: 'RTP',
} as const;

export type TConnectivityPaymentsScheme =
  (typeof CONNECTIVITY_PAYMENTS_SCHEME)[keyof typeof CONNECTIVITY_PAYMENTS_SCHEME];

export const TRANSFER_INITIATION_STATUS = {
  Unknown: 'UNKNOWN', // v3
  WaitingForValidation: 'WAITING_FOR_VALIDATION',
  ScheduledForProcessing: 'SCHEDULED_FOR_PROCESSING', // v3
  Processing: 'PROCESSING',
  Processed: 'PROCESSED',
  Failed: 'FAILED',
  Rejected: 'REJECTED',
  Validated: 'VALIDATED', // v1-v2
  AskRetried: 'ASK_RETRIED', // v1-v2
  AskReversed: 'ASK_REVERSED', // v1-v2
  ReverseProcessing: 'REVERSE_PROCESSING',
  ReverseFailed: 'REVERSE_FAILED',
  PartiallyReversed: 'PARTIALLY_REVERSED', // v1-v2
  Reversed: 'REVERSED',
} as const;

export type TTransferInitiationStatus =
  (typeof TRANSFER_INITIATION_STATUS)[keyof typeof TRANSFER_INITIATION_STATUS];

export const TRANSFER_INITIATION_TYPE = TransferInitiationType;

export type TTransferInitiationType =
  (typeof TRANSFER_INITIATION_TYPE)[keyof typeof TRANSFER_INITIATION_TYPE];
