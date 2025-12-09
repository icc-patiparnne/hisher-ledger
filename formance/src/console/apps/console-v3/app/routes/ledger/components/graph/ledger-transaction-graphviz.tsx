import { Graphviz } from 'graphviz-react';
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CircleDashedIcon,
  GripHorizontalIcon,
  Workflow,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  attribute,
  digraph,
  EdgeAttributesObject,
  NodeAttributesObject,
  toDot,
} from 'ts-graphviz';

import {
  AppCard,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@platform/ui';
import { formatNumber } from '@platform/utils';
import { NormalizedTransactionModel } from '../../../../utils/sdk/ledger/models';

type TLedgerTransactionGraphGraphvizProps = {
  ledgerTransaction: NormalizedTransactionModel;
} & React.HTMLAttributes<HTMLDivElement>;

const ENGINE = {
  DOT: {
    icon: <GripHorizontalIcon />,
    value: 'dot',
  },
  CIRCO: {
    icon: <CircleDashedIcon />,
    value: 'circo',
  },
} as const;

type TEngine = keyof typeof ENGINE;

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

type TDirection = keyof typeof DIRECTION;

const NODE_ATTRIBUTES_DEFAULT: NodeAttributesObject = {
  [attribute.color]: 'transparent',
  [attribute.fontname]: 'Figtree',
  [attribute.fontsize]: 12,
  [attribute.shape]: 'oval',
  [attribute.style]: 'filled,rounded',
};

const EDGE_ATTRIBUTES_DEFAULT: EdgeAttributesObject = {
  [attribute.fontname]: 'Figtree',
  [attribute.fontsize]: 10,
  [attribute.style]: 'dashed',
};

const WORLD_ACCOUNT: NodeAttributesObject = {
  [attribute.fillcolor]: '#a3e63533',
  [attribute.fontcolor]: '#4d7c0f',
};

const DEFAULT_ACCOUNT: NodeAttributesObject = {
  [attribute.fillcolor]: '#8b5cf626',
  [attribute.fontcolor]: '#6d28d9',
};

export default function LedgerTransactionGraphGraphviz({
  ledgerTransaction,
  children,
}: TLedgerTransactionGraphGraphvizProps) {
  const [engine, setEngine] = useState<TEngine>('DOT');
  const [direction, setDirection] = useState<TDirection>('RIGHT');

  const graphvizDot = useMemo(() => {
    const postings = ledgerTransaction.postings;

    const graph = digraph(
      'G',
      {
        [attribute.rankdir]: DIRECTION[direction].value,
      },
      (g) => {
        const nodes = new Map<string, any>();
        postings.forEach((posting) => {
          if (!nodes.has(posting.source)) {
            nodes.set(
              posting.source,
              g.node(posting.source, {
                ...NODE_ATTRIBUTES_DEFAULT,
                ...(posting.source === 'world'
                  ? WORLD_ACCOUNT
                  : DEFAULT_ACCOUNT),
                [attribute.label]: posting.source,
              })
            );
          }
          if (!nodes.has(posting.destination)) {
            nodes.set(
              posting.destination,
              g.node(posting.destination, {
                ...NODE_ATTRIBUTES_DEFAULT,
                ...(posting.destination === 'world'
                  ? WORLD_ACCOUNT
                  : DEFAULT_ACCOUNT),
                [attribute.label]: posting.destination,
              })
            );
          }
        });

        postings.forEach((posting) => {
          const sourceNode = nodes.get(posting.source);
          const destinationNode = nodes.get(posting.destination);
          g.edge([sourceNode, destinationNode], {
            ...EDGE_ATTRIBUTES_DEFAULT,
            [attribute.label]: `${formatNumber(posting.amount)} ${
              posting.asset
            }`,
          });
        });
      }
    );

    return toDot(graph);
  }, [ledgerTransaction, direction, engine]);

  return (
    <AppCard
      title="Transaction Graph"
      description="Graph of the transaction"
      variant="cobaltDark"
      appIcon={Workflow}
    >
      <div className="absolute flex items-center gap-2 top-2 right-6">
        {/* Direction - Only show when engine is DOT */}
        {engine === 'DOT' && (
          <div className="grid gap-2">
            <Label>Direction</Label>
            <Select
              value={direction}
              onValueChange={(value: keyof typeof DIRECTION) =>
                setDirection(value)
              }
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
        )}

        {/* Engine */}
        <div className="grid gap-2">
          <Label>Engine</Label>
          <Select
            value={engine}
            onValueChange={(value: TEngine) => setEngine(value)}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Select an engine" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ENGINE).map(([key, value]) => (
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
      <div className="border border-border rounded-lg w-full h-[400px] lg:h-[600px] overflow-auto">
        <div className="flex h-full justify-center items-center w-full">
          <Graphviz
            className="[&>svg]:overflow-visible"
            dot={graphvizDot}
            options={{
              engine: ENGINE[engine].value,
              zoom: true,
            }}
          />
        </div>
      </div>
    </AppCard>
  );
}
