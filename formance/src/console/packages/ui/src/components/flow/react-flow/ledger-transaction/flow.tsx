'use client';

import { useEffect } from 'react';

import {
  ConnectionLineType,
  Controls,
  DefaultEdgeOptions,
  Edge,
  MarkerType,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';

import useAutoLayout, {
  type LayoutOptions,
} from '../auto-layout/useAutoLayout';

import '@xyflow/react/dist/style.css';
import { AmountEdge } from './custom-edges';
import { AccountNode } from './custom-nodes';

const proOptions = {
  account: 'paid-pro',
  hideAttribution: true,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: { type: MarkerType.Arrow },
  animated: true,
  labelStyle: {
    fill: 'black',
    fontSize: 12,
  },
};

/**
 * This example shows how you can automatically arrange your nodes after adding child nodes to your graph.
 */
export function ReactFlowAutoLayout({
  initialNodes,
  initialEdges,
  children,
  layoutOptions,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
  children: React.ReactNode;
  layoutOptions: LayoutOptions;
}) {
  const { fitView } = useReactFlow();

  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, __, onEdgesChange] = useEdgesState(initialEdges);

  const edgeTypes = {
    amount: AmountEdge,
  };

  const nodeTypes = {
    account: AccountNode,
  };

  // this hook handles the computation of the layout once the elements or the direction changes
  useAutoLayout(layoutOptions);

  // every time our nodes change, we want to center the graph again
  useEffect(() => {
    fitView();
  }, [nodes, fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodesDraggable={true}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineType={ConnectionLineType.SmoothStep}
      proOptions={proOptions}
      zoomOnDoubleClick={false}
      fitView={true}
    >
      {children}
      <Controls className="dark:[--xy-controls-button-background-color:hsl(var(--muted))] dark:[--xy-controls-button-color-hover:hsl(var(--muted))] dark:  dark:[--xy-controls-button-border-color:hsl(var(--border))]" />
    </ReactFlow>
  );
}
