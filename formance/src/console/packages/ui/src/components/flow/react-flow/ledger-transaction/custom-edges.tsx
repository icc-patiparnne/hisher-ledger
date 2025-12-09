import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';

import { Chip } from '../../../app';
import { formatNumber } from '@platform/utils';

type AmountEdgeProps = EdgeProps & {
  data: {
    amount: string;
    asset: string;
  };
};

export function AmountEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: AmountEdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
          }}
          className="nodrag nopan"
        >
          <Chip
            variant="orange"
            label={`${formatNumber(data?.amount)} ${data?.asset}`}
            size="sm"
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
