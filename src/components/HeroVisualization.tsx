import { memo, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

interface Node {
  id: string;
  x: number;
  y: number;
  color: string;
  r: number;
  delay: number;
}

interface Edge {
  from: string;
  to: string;
  delay: number;
}

const NODES: Node[] = [
  { id: 'prompt', x: 60, y: 120, color: '#f59e0b', r: 8, delay: 0 },
  { id: 'route', x: 160, y: 70, color: '#10b981', r: 6, delay: 0.2 },
  { id: 'parallel', x: 280, y: 40, color: '#3b82f6', r: 7, delay: 0.4 },
  { id: 'reflect', x: 400, y: 80, color: '#ec4899', r: 6, delay: 0.6 },
  { id: 'tool', x: 510, y: 130, color: '#f97316', r: 8, delay: 0.8 },
  { id: 'plan', x: 130, y: 270, color: '#14b8a6', r: 7, delay: 0.3 },
  { id: 'agent', x: 280, y: 230, color: '#8b5cf6', r: 9, delay: 0.5 },
  { id: 'memory', x: 430, y: 260, color: '#06b6d4', r: 7, delay: 0.7 },
  { id: 'rag', x: 80, y: 380, color: '#3b82f6', r: 5, delay: 0.6 },
  { id: 'guard', x: 230, y: 400, color: '#10b981', r: 6, delay: 0.9 },
  { id: 'eval', x: 370, y: 390, color: '#06b6d4', r: 5, delay: 1.0 },
  { id: 'output', x: 510, y: 370, color: '#22c55e', r: 8, delay: 1.1 },
];

const EDGES: Edge[] = [
  { from: 'prompt', to: 'route', delay: 0.3 },
  { from: 'route', to: 'parallel', delay: 0.5 },
  { from: 'parallel', to: 'reflect', delay: 0.7 },
  { from: 'reflect', to: 'tool', delay: 0.9 },
  { from: 'prompt', to: 'plan', delay: 0.4 },
  { from: 'plan', to: 'agent', delay: 0.6 },
  { from: 'agent', to: 'memory', delay: 0.8 },
  { from: 'route', to: 'agent', delay: 0.7 },
  { from: 'tool', to: 'memory', delay: 1.0 },
  { from: 'plan', to: 'rag', delay: 0.8 },
  { from: 'agent', to: 'guard', delay: 1.0 },
  { from: 'memory', to: 'eval', delay: 1.1 },
  { from: 'guard', to: 'eval', delay: 1.2 },
  { from: 'eval', to: 'output', delay: 1.3 },
  { from: 'rag', to: 'guard', delay: 1.1 },
  { from: 'tool', to: 'output', delay: 1.2 },
];

const FlowParticle = memo(function FlowParticle({ fromNode, toNode, delay }: { fromNode: Node; toNode: Node; delay: number }) {
  return (
    <circle r="1.5" fill={fromNode.color} opacity="0">
      <animateMotion
        dur="4s"
        begin={`${delay + 2}s`}
        repeatCount="indefinite"
        path={`M${fromNode.x},${fromNode.y} L${toNode.x},${toNode.y}`}
      />
      <animate
        attributeName="opacity"
        values="0;0.7;0.7;0"
        dur="4s"
        begin={`${delay + 2}s`}
        repeatCount="indefinite"
      />
    </circle>
  );
});

export default function HeroVisualization() {
  const prefersReducedMotion = useReducedMotion();

  const nodeMap = useMemo(() => {
    const map: Record<string, Node> = {};
    NODES.forEach((n) => (map[n.id] = n));
    return map;
  }, []);

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <svg
          viewBox="0 0 560 440"
          className="w-full h-full opacity-[0.08]"
          preserveAspectRatio="xMidYMid slice"
        >
          {EDGES.map((edge) => {
            const from = nodeMap[edge.from];
            const to = nodeMap[edge.to];
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={from.color}
                strokeWidth="1"
                opacity="0.4"
              />
            );
          })}
          {NODES.map((node) => (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={node.color}
              opacity="0.4"
            />
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        viewBox="0 0 560 440"
        className="w-full h-full hero-viz"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="hero-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {EDGES.map((edge) => {
          const from = nodeMap[edge.from];
          const to = nodeMap[edge.to];
          return (
            <line
              key={`edge-${edge.from}-${edge.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={from.color}
              strokeWidth="0.8"
              opacity="0"
              className="hero-edge"
              style={{ animationDelay: `${edge.delay + 0.8}s` }}
            />
          );
        })}

        {/* Flow particles */}
        {EDGES.map((edge) => (
          <FlowParticle
            key={`flow-${edge.from}-${edge.to}`}
            fromNode={nodeMap[edge.from]}
            toNode={nodeMap[edge.to]}
            delay={edge.delay}
          />
        ))}

        {/* Nodes */}
        {NODES.map((node) => (
          <g key={node.id}>
            {/* Pulse ring */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r + 4}
              fill="none"
              stroke={node.color}
              strokeWidth="0.5"
              opacity="0"
              className="hero-pulse"
              style={{ animationDelay: `${node.delay + 2}s` }}
            />
            {/* Core dot */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={node.color}
              opacity="0"
              filter="url(#hero-glow)"
              className="hero-node-core"
              style={{ animationDelay: `${node.delay}s` }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
