import React, { useState } from 'react';

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@platform/ui';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { NormalizedTransactionModel } from '../../../utils/sdk/ledger/models';
import LedgerTransactionGraphGraphviz from './graph/ledger-transaction-graphviz';
import LedgerTransactionReactFlow from './graph/ledger-transaction-react-flow';

type TLedgerTransactionsProps = {
  ledgerTransaction: NormalizedTransactionModel;
} & React.HTMLAttributes<HTMLDivElement>;

const GRAPH_TYPE = {
  'FLOW 1': 'flow-1',
  'FLOW 2': 'flow-2',
};

type TGraphType = keyof typeof GRAPH_TYPE;

export default function LedgerTransactionGraph({
  ledgerTransaction,
}: TLedgerTransactionsProps) {
  useRouteGuard({
    componentName: 'ledger-transaction-graph',
    requiredParams: ['ledgerName', 'transactionId'],
  });

  const [graphType, setGraphType] = useState<TGraphType>('FLOW 1');

  return (
    <div className="relative light">
      {graphType === 'FLOW 1' ? (
        <LedgerTransactionGraphGraphviz ledgerTransaction={ledgerTransaction}>
          <GraphTypeSelect graphType={graphType} setGraphType={setGraphType} />
        </LedgerTransactionGraphGraphviz>
      ) : (
        <LedgerTransactionReactFlow ledgerTransaction={ledgerTransaction}>
          <GraphTypeSelect graphType={graphType} setGraphType={setGraphType} />
        </LedgerTransactionReactFlow>
      )}
    </div>
  );
}

function GraphTypeSelect({
  graphType,
  setGraphType,
}: {
  graphType: TGraphType;
  setGraphType: (value: TGraphType) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label>Graph Type</Label>
      <Select
        value={graphType}
        onValueChange={(value) => setGraphType(value as TGraphType)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Select graph type" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(GRAPH_TYPE).map(([key]) => (
            <SelectItem key={key} value={key}>
              <span className="capitalize">{key.toLowerCase()}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
