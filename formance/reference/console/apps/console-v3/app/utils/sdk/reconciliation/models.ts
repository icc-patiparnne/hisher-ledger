export type NormalizedReconciliationModel = {
  id: string;
  policyID: string;
  policyName?: string;
  createdAt: Date;
  reconciledAtLedger: Date;
  reconciledAtPayments: Date;
  status: string;
  paymentsBalances: { [k: string]: bigint };
  ledgerBalances: { [k: string]: bigint };
  driftBalances: { [k: string]: bigint };
  error?: string | undefined;
  balances?: NormalizedReconciliationBalancesModel[];
};
export type NormalizedPolicyModel = {
  id: string;
  name: string;
  createdAt: Date;
  ledgerName: string;
  ledgerQuery: { [k: string]: any };
  paymentsPoolID: string;
};
export type NormalizedReconciliationBalancesModel = {
  ledgerBalances: string;
  paymentsBalances: string | undefined;
  driftBalances: string | undefined;
};
