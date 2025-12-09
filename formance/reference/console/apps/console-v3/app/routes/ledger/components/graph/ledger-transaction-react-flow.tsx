import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  GitBranchIcon,
  GripHorizontalIcon,
  Workflow,
  WorkflowIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  Edge as ReactFlowEdge,
  Node as ReactFlowNode,
  ReactFlowProvider,
} from '@xyflow/react';

import {
  AppCard,
  Label,
  ReactFlowAutoLayout,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@platform/ui';
import { NormalizedTransactionModel } from '../../../../utils/sdk/ledger/models';

type TLedgerTransactionReactFlowProps = {
  ledgerTransaction: NormalizedTransactionModel;
} & React.HTMLAttributes<HTMLDivElement>;

type CustomNode = ReactFlowNode<{
  label: string;
  hasIncoming: boolean;
  hasOutgoing: boolean;
}>;

type CustomEdge = ReactFlowEdge<{
  amount: number;
  asset: string;
}>;

const ALGORITHM = {
  DAGRE: {
    icon: <GripHorizontalIcon />,
    value: 'dagre',
  },
  D3: {
    icon: <WorkflowIcon />,
    value: 'd3-hierarchy',
  },
  ELK: {
    icon: <GitBranchIcon />,
    value: 'elk',
  },
} as const;

const DIRECTION = {
  DOWN: {
    icon: <ArrowDownIcon />,
    value: 'TB',
  },
  RIGHT: {
    icon: <ArrowRightIcon />,
    value: 'LR',
  },
  UP: {
    icon: <ArrowUpIcon />,
    value: 'BT',
  },
  LEFT: {
    icon: <ArrowLeftIcon />,
    value: 'RL',
  },
} as const;

type TAlgorithm = keyof typeof ALGORITHM;
type TDirection = keyof typeof DIRECTION;

export default function LedgerTransactionReactFlow({
  ledgerTransaction,
  children,
}: TLedgerTransactionReactFlowProps) {
  const [algorithm, setAlgorithm] = useState<TAlgorithm>('DAGRE');
  const [direction, setDirection] = useState<TDirection>('RIGHT');

  const { nodes, edges } = useMemo(() => {
    const nodes: CustomNode[] = [];
    const edges: CustomEdge[] = [];
    const uniqueAccounts = new Set<string>();
    const nodeConnections = new Map<
      string,
      { hasIncoming: boolean; hasOutgoing: boolean }
    >();
    const aggregatedEdges = new Map<
      string,
      { amount: number; asset: string }
    >();

    if (ledgerTransaction?.postings) {
      ledgerTransaction?.postings.forEach((posting) => {
        uniqueAccounts.add(posting.source);
        uniqueAccounts.add(posting.destination);

        // Track incoming and outgoing connections
        if (!nodeConnections.has(posting.source)) {
          nodeConnections.set(posting.source, {
            hasIncoming: false,
            hasOutgoing: true,
          });
        } else {
          nodeConnections.get(posting.source)!.hasOutgoing = true;
        }

        if (!nodeConnections.has(posting.destination)) {
          nodeConnections.set(posting.destination, {
            hasIncoming: true,
            hasOutgoing: false,
          });
        } else {
          nodeConnections.get(posting.destination)!.hasIncoming = true;
        }

        // Create a unique key for each source-destination-asset combination
        const edgeKey = `${posting.source}_to_${posting.destination}_${posting.asset}`;

        if (aggregatedEdges.has(edgeKey)) {
          // Add to existing amount
          const existing = aggregatedEdges.get(edgeKey)!;
          aggregatedEdges.set(edgeKey, {
            amount: existing.amount + Number(posting.amount),
            asset: posting.asset,
          });
        } else {
          // Create new entry
          aggregatedEdges.set(edgeKey, {
            amount: Number(posting.amount),
            asset: posting.asset,
          });
        }
      });

      // Create nodes for each unique account
      Array.from(uniqueAccounts).forEach((account) => {
        const connections = nodeConnections.get(account) ?? {
          hasIncoming: false,
          hasOutgoing: false,
        };
        nodes.push({
          id: account,
          type: 'account',
          data: {
            label: account,
            hasIncoming: connections.hasIncoming,
            hasOutgoing: connections.hasOutgoing,
          },
          position: { x: 0, y: 0 },
          style: { opacity: 1 },
        });
      });

      // Create edges from aggregated amounts
      Array.from(aggregatedEdges.entries()).forEach(([key, value]) => {
        // Extract source and destination from the key
        const parts = key.split('_to_');
        if (parts.length !== 2) return; // Skip invalid keys

        const source = parts[0];
        const destination = parts[1];
        if (!source || !destination) return; // Skip if either is missing

        const [destinationPart] = destination.split('_');
        if (!destinationPart) return; // Skip if destination part is missing

        edges.push({
          id: key,
          type: 'amount',
          source,
          target: destinationPart,
          data: { amount: value.amount, asset: value.asset },
          label: `${value.amount} ${value.asset}`,
          style: { opacity: 1 },
        });
      });
    }

    return { nodes, edges };
  }, [ledgerTransaction]);

  return (
    <AppCard
      title="Transaction Graph"
      description="Graph of the transaction"
      variant="cobaltDark"
      appIcon={Workflow}
    >
      <div className="absolute flex items-center gap-2 top-2 right-6">
        {/* Direction */}
        <div className="grid gap-2">
          <Label>Direction</Label>
          <Select
            value={direction}
            onValueChange={(value: TDirection) => setDirection(value)}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Select a direction" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DIRECTION).map(([key, value]) => (
                <SelectItem className="lowercase" key={key} value={key}>
                  <div className="flex items-center gap-2 w-6 h-6">
                    {value.icon}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Algorithm */}
        <div className="grid gap-2">
          <Label>Algorithm</Label>
          <Select
            value={algorithm}
            onValueChange={(value: TAlgorithm) => setAlgorithm(value)}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Select an algorithm" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ALGORITHM).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2 w-6 h-6">
                    {value.icon}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {children}
      </div>
      <div className="border border-border rounded-lg w-full h-[400px] lg:h-[600px]">
        <ReactFlowProvider>
          <ReactFlowAutoLayout
            initialEdges={edges}
            initialNodes={nodes}
            layoutOptions={{
              direction: DIRECTION[direction].value,
              algorithm: ALGORITHM[algorithm].value,
              spacing: [100, 200],
            }}
          >
            <></>
          </ReactFlowAutoLayout>
        </ReactFlowProvider>
      </div>
    </AppCard>
  );
}
