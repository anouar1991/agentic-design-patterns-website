/**
 * EnhancedNode
 *
 * An interactive node for React Flow diagrams that:
 * - Shows visual feedback on hover and selection
 * - Displays role-based styling (input/process/output)
 * - Pulses when it has linked code examples
 * - Supports click to show detail panel
 * - Shows tooltip on hover with description and role
 * - Click ripple animation for tactile feedback
 */

import { memo, useState, useRef, useCallback } from 'react';
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

// Role display names for tooltip
const roleLabels: Record<NodeRole, string> = {
  input: 'Input',
  process: 'Process',
  output: 'Output',
  decision: 'Decision',
  handler: 'Handler',
  tool: 'Tool',
  agent: 'Agent',
  memory: 'Memory',
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

  // Tooltip state
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Click ripple state
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const rippleCounter = useRef(0);

  const selectCurrentNode = useCallback(() => {
    if (diagramContext) {
      const node = {
        id,
        position: { x: 0, y: 0 },
        data: nodeData,
      };
      diagramContext.selectNode(node);
    }
  }, [diagramContext, id, nodeData]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Trigger ripple animation at click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rippleCounter.current += 1;
    setRipple({ x, y, key: rippleCounter.current });

    selectCurrentNode();
  }, [selectCurrentNode]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectCurrentNode();
    }
  }, [selectCurrentNode]);

  const handleMouseEnter = useCallback(() => {
    diagramContext?.setHoveredNodeId(id);
    // Show tooltip after a short delay
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 400);
  }, [diagramContext, id]);

  const handleMouseLeave = useCallback(() => {
    diagramContext?.setHoveredNodeId(null);
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setShowTooltip(false);
  }, [diagramContext]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${nodeData.label}${nodeData.description ? `: ${nodeData.description}` : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
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

      {/* Click ripple effect */}
      {ripple && (
        <span
          key={ripple.key}
          className="node-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: `${color}40`,
          }}
          onAnimationEnd={() => setRipple(null)}
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

      {/* Hover tooltip */}
      {showTooltip && !isSelected && nodeData.detailedHint && (
        <div
          className="node-tooltip"
          style={{ borderColor: `${color}40` }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {roleLabels[role]}
            </span>
            {hasCodeLink && (
              <span className="text-[10px] text-dark-500 flex items-center gap-0.5">
                <Code className="w-2.5 h-2.5" />
                Has code
              </span>
            )}
          </div>
          <p className="text-[11px] text-dark-300 leading-relaxed line-clamp-3">
            {nodeData.detailedHint}
          </p>
          <p className="text-[10px] text-dark-500 mt-1">Click for details</p>
        </div>
      )}
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(EnhancedNode);
