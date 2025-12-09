import { Handle, Position } from '@xyflow/react';

import { Chip } from '../../../app/';

interface AccountNodeData {
  label: string;
  hasIncoming: boolean;
  hasOutgoing: boolean;
}

export function AccountNode({ data }: { data: AccountNodeData }) {
  return (
    <div>
      <Chip
        label={data.label}
        variant={data.label === 'world' ? 'lime' : 'violet'}
      />

      {data.hasIncoming && <Handle type="target" position={Position.Left} />}
      {data.hasOutgoing && <Handle type="source" position={Position.Right} />}
    </div>
  );
}
