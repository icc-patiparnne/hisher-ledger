export type TRouteParams = {
  organizationId: string;
  stackId: string;
  ledgerName: string;
  transactionId: string;
  address: string;
  clientId: string;
  paymentId: string;
  paymentAccountId: string;
  paymentCashPoolId: string;
  paymentTransferId: string;
  paymentBankAccountId: string;
  connectorId: string;
  connectorSlug: string;
  taskId: string;
  walletId: string;
  walletHoldId: string;
  reportId: string;
  policyId: string;
  workflowId: string;
  instanceId: string;
  triggerId: string;
  webhookId: string;
};

export type TSearchParams = {
  region: string;
  provider: string;
};

export type TRouteParamsWithSearchParams = TRouteParams & TSearchParams;
