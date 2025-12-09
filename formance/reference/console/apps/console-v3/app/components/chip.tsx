import { V2LogType } from '@platform/sdks/formance/src/models/components';
import { TChipProps } from '@platform/ui';

type TChipVariantTypes =
  | 'id'
  | 'organizationId'
  | 'stackId'
  | 'transactionId'
  | 'ledger'
  | 'policy'
  | 'scopes'
  | 'report'
  | 'wallet'
  | 'name'
  | 'string'
  | 'reference'
  | 'apiKey'
  | 'scheme'
  | 'version'
  | 'public'
  | 'private'
  | 'stats'
  | 'true'
  | 'false'
  | 'undefined';

const chipVariantFromConsoleType: Record<
  TChipVariantTypes,
  {
    variant: TChipProps['variant'];
    isMono: TChipProps['isMono'];
  }
> = {
  id: {
    variant: 'zinc',
    isMono: true,
  },
  organizationId: {
    variant: 'teal',
    isMono: false,
  },
  stackId: {
    variant: 'zinc',
    isMono: false,
  },
  transactionId: {
    variant: 'zinc',
    isMono: true,
  },
  ledger: {
    variant: 'teal',
    isMono: false,
  },
  report: {
    variant: 'teal',
    isMono: false,
  },
  policy: {
    variant: 'zinc',
    isMono: true,
  },
  scopes: {
    variant: 'blue',
    isMono: false,
  },
  wallet: {
    variant: 'rose',
    isMono: false,
  },
  name: {
    variant: 'info',
    isMono: false,
  },
  string: {
    variant: 'zinc',
    isMono: false,
  },
  reference: {
    variant: 'purple',
    isMono: true,
  },
  apiKey: {
    variant: 'zinc',
    isMono: true,
  },
  scheme: {
    variant: 'yellow',
    isMono: false,
  },

  version: {
    variant: 'primary',
    isMono: true,
  },
  public: {
    variant: 'green',
    isMono: false,
  },
  private: {
    variant: 'orange',
    isMono: false,
  },
  stats: {
    variant: 'fuchsia',
    isMono: false,
  },
  true: {
    variant: 'valid',
    isMono: false,
  },
  false: {
    variant: 'destructive',
    isMono: false,
  },
  undefined: {
    variant: 'zinc',
    isMono: false,
  },
};

const chipVariantFromLogType: Record<
  V2LogType,
  {
    variant: TChipProps['variant'];
    isMono: TChipProps['isMono'];
  }
> = {
  NEW_TRANSACTION: {
    variant: 'sky',
    isMono: false,
  },
  SET_METADATA: {
    variant: 'amber',
    isMono: false,
  },
  REVERTED_TRANSACTION: {
    variant: 'red',
    isMono: false,
  },
  DELETE_METADATA: {
    variant: 'orange',
    isMono: false,
  },
};

const chipVariantFromWebhookEventTypes: Record<
  string,
  {
    variant: TChipProps['variant'];
    isMono: TChipProps['isMono'];
  }
> = {
  'ledger.committed_transactions': {
    variant: 'emerald',
    isMono: false,
  },
  'ledger.deleted_metadata': {
    variant: 'emerald',
    isMono: false,
  },
  'ledger.reverted_transaction': {
    variant: 'emerald',
    isMono: false,
  },
  'ledger.saved_metadata': {
    variant: 'emerald',
    isMono: false,
  },
  'orchestration.failed_trigger': {
    variant: 'gold',
    isMono: false,
  },
  'orchestration.failed_workflow': {
    variant: 'gold',
    isMono: false,
  },
  'orchestration.failed_workflow_stage': {
    variant: 'gold',
    isMono: false,
  },
  'orchestration.started_workflow': {
    variant: 'gold',
    isMono: false,
  },
  'orchestration.started_workflow_stage': {
    variant: 'gold',
    isMono: false,
  },
  'orchestration.succeeded_trigger': {
    variant: 'gold',
    isMono: false,
  },
  'orchestration.succeeded_workflow': {
    variant: 'gold',
    isMono: false,
  },
  'orchestration.succeeded_workflow_stage': {
    variant: 'gold',
    isMono: false,
  },
  'payments.connector_reset': {
    variant: 'lilac',
    isMono: false,
  },
  'payments.deleted_pool': {
    variant: 'lilac',
    isMono: false,
  },
  'payments.saved_account': {
    variant: 'lilac',
    isMono: false,
  },
  'payments.saved_balance': {
    variant: 'lilac',
    isMono: false,
  },
  'payments.saved_bank_account': {
    variant: 'lilac',
    isMono: false,
  },
  'payments.saved_payment': {
    variant: 'lilac',
    isMono: false,
  },
};

export {
  chipVariantFromConsoleType,
  chipVariantFromLogType,
  chipVariantFromWebhookEventTypes,
};
