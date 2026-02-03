/**
 * EnhancedNode
 *
 * An interactive node for React Flow diagrams that:
 * - Shows visual feedback on hover and selection
 * - Displays role-based styling (input/process/output)
 * - Pulses when it has linked code examples
 * - Supports click to show detail panel
 */

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Code, ArrowRight, CircleDot, Database, Cog, CheckCircle2, Wrench, Bot, Brain } from 'lucide-react';
import { useDiagramOptional } from '../../contexts/DiagramContext';
import type { NodeRole } from '../../data/types';

interface EnhancedNodeData {
  label: string;
  description?: string;
  color?: string;
  role?: NodeRole;
  detailedHint?: string;
  codeExampleIndex?: number;
  codeHighlightLines?: number[];
  conceptIds?: string[];
}

// Role-based icon mapping
const roleIcons: Record<NodeRole, React.ElementType> = {
  input: Database,
  process: Cog,
  output: CheckCircle2,
  decision: CircleDot,
  handler: ArrowRight,
  tool: Wrench,
  agent: Bot,
  memory: Brain,
};

// Role-based default colors
const roleColors: Record<NodeRole, string> = {
  input: '#64748b',
  process: '#f59e0b',
  output: '#22c55e',
  decision: '#8b5cf6',
  handler: '#3b82f6',
  tool: '#06b6d4',
  agent: '#f97316',
  memory: '#ec4899',
};

function EnhancedNode({ data, selected, id }: NodeProps) {
  const nodeData = data as unknown as EnhancedNodeData;
  const diagramContext = useDiagramOptional();

  const role = nodeData.role || 'process';
  const color = nodeData.color || roleColors[role];
  const RoleIcon = roleIcons[role];
  const hasCodeLink = nodeData.codeExampleIndex !== undefined;

  const isSelected = selected || diagramContext?.selectedNodeId === id;
  const isHovered = diagramContext?.hoveredNodeId === id;

  const handleClick = () => {
    if (diagramContext) {
      const node = {
        id,
        position: { x: 0, y: 0 }, // Position not needed for selection
        data: nodeData,
      };
      diagramContext.selectNode(node);
    }
  };

  const handleMouseEnter = () => {
    diagramContext?.setHoveredNodeId(id);
  };

  const handleMouseLeave = () => {
    diagramContext?.setHoveredNodeId(null);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative px-4 py-3 rounded-xl min-w-[140px] cursor-pointer
        transition-all duration-200 ease-out
        ${isSelected ? 'ring-2 ring-offset-2 ring-offset-dark-900 scale-105' : ''}
        ${isHovered && !isSelected ? 'scale-102' : ''}
        ${hasCodeLink ? 'animate-pulse-subtle' : ''}
      `}
      style={{
        backgroundColor: `${color}15`,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: isSelected ? color : isHovered ? `${color}80` : `${color}40`,
        boxShadow: isSelected
          ? `0 0 20px ${color}40, 0 4px 12px rgba(0,0,0,0.3)`
          : isHovered
          ? `0 0 12px ${color}20, 0 2px 8px rgba(0,0,0,0.2)`
          : '0 2px 8px rgba(0,0,0,0.2)',
        ...(isSelected ? { ringColor: color } : {}),
      }}
    >
      {/* Input handle (left side) */}
      {role !== 'input' && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !border-2 !border-dark-800"
          style={{ backgroundColor: color }}
        />
      )}

      {/* Node content */}
      <div className="flex items-start gap-2">
        {/* Role icon */}
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: `${color}30` }}
        >
          <RoleIcon className="w-3.5 h-3.5" style={{ color }} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Label */}
          <div className="text-sm font-semibold text-white truncate">
            {nodeData.label}
          </div>

          {/* Description */}
          {nodeData.description && (
            <div className="text-xs text-dark-400 mt-0.5 line-clamp-2">
              {nodeData.description}
            </div>
          )}
        </div>
      </div>

      {/* Code link indicator */}
      {hasCodeLink && (
        <div
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: color }}
          title="Click to see code"
        >
          <Code className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Output handle (right side) */}
      {role !== 'output' && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !border-2 !border-dark-800"
          style={{ backgroundColor: color }}
        />
      )}

      {/* Selection glow effect */}
      {isSelected && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none animate-glow"
          style={{
            background: `radial-gradient(ellipse at center, ${color}20 0%, transparent 70%)`,
          }}
        />
      )}
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(EnhancedNode);
