/**
 * InteractiveDiagram
 *
 * Main container for the enhanced React Flow diagram.
 * Features:
 * - Full-screen mode toggle
 * - Custom node types with enhanced interactivity
 * - Node detail panel integration
 * - Edge highlighting on node hover
 * - Keyboard shortcuts (Escape to clear selection)
 */

import { useMemo, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReactFlow,
  Background,
  MiniMap,
  MarkerType,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Maximize2, Minimize2, Play, MousePointer2, ZoomIn, ZoomOut, Crosshair } from 'lucide-react';
import { useDiagram } from '../../contexts/DiagramContext';
import EnhancedNode from './EnhancedNode';
import NodeDetailPanel from './NodeDetailPanel';
import type { DiagramNode, DiagramEdge } from '../../data/types';

const nodeTypes = {
  enhanced: EnhancedNode,
  custom: EnhancedNode, // Backward compatibility with existing data
};

interface InteractiveDiagramProps {
  diagramNodes: DiagramNode[];
  diagramEdges: DiagramEdge[];
  chapterColor: string;
  title?: string;
}

// Custom zoom controls component (needs to be inside ReactFlowProvider)
function CustomZoomControls({ chapterColor }: { chapterColor: string }) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 200 });
    setZoomLevel((prev) => Math.min(prev + 20, 200));
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 200 });
    setZoomLevel((prev) => Math.max(prev - 20, 30));
  }, [zoomOut]);

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 300 });
    setZoomLevel(100);
  }, [fitView]);

  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1">
      <button
        onClick={handleZoomIn}
        className="p-2 rounded-lg glass-elevated text-dark-300 hover:text-dark-50 transition-colors"
        title="Zoom in"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <div className="text-[10px] text-dark-500 text-center py-0.5">
        {zoomLevel}%
      </div>
      <button
        onClick={handleZoomOut}
        className="p-2 rounded-lg glass-elevated text-dark-300 hover:text-dark-50 transition-colors"
        title="Zoom out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <div className="h-px bg-dark-700 my-1" />
      <button
        onClick={handleFitView}
        className="p-2 rounded-lg glass-elevated text-dark-300 hover:text-dark-50 transition-colors"
        title="Fit to view"
        style={{ color: chapterColor }}
      >
        <Crosshair className="w-4 h-4" />
      </button>
    </div>
  );
}

function InteractiveDiagramInner({
  diagramNodes,
  diagramEdges,
  chapterColor,
  title = 'Pattern Flow',
}: InteractiveDiagramProps) {
  const {
    selectedNodeId,
    hoveredNodeId,
    clearSelection,
    isFullScreen,
    toggleFullScreen,
  } = useDiagram();

  // Transform diagram data for React Flow
  const initialNodes = useMemo<Node[]>(() => {
    return diagramNodes.map((node) => ({
      id: node.id,
      type: 'enhanced',
      position: node.position,
      data: {
        ...node.data,
        role: node.data.role || 'process',
      },
    }));
  }, [diagramNodes]);

  // Edge end marker for flow direction
  const edgeMarker = useMemo(() => ({
    type: MarkerType.ArrowClosed,
    width: 16,
    height: 16,
    color: '#64748b',
  }), []);

  const initialEdges = useMemo<Edge[]>(() => {
    return diagramEdges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: edge.animated !== false, // default to animated
      markerEnd: {
        ...edgeMarker,
        color: '#64748b',
      },
      style: {
        stroke: '#64748b',
        strokeWidth: 2,
        ...edge.style,
      },
      labelStyle: { fill: '#94a3b8', fontSize: 12 },
    }));
  }, [diagramEdges, edgeMarker]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update edge highlighting based on hovered/selected node
  useEffect(() => {
    const activeNodeId = hoveredNodeId || selectedNodeId;

    setEdges((eds) =>
      eds.map((edge) => {
        const isConnected =
          activeNodeId &&
          (edge.source === activeNodeId || edge.target === activeNodeId);

        return {
          ...edge,
          style: {
            ...edge.style,
            stroke: isConnected ? chapterColor : '#64748b',
            strokeWidth: isConnected ? 3 : 2,
            opacity: activeNodeId && !isConnected ? 0.3 : 1,
          },
          markerEnd: {
            ...edgeMarker,
            color: isConnected ? chapterColor : '#64748b',
          },
          animated: isConnected || edge.animated,
        };
      })
    );
  }, [hoveredNodeId, selectedNodeId, chapterColor, setEdges, edgeMarker]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullScreen) {
          toggleFullScreen();
        } else {
          clearSelection();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, toggleFullScreen, clearSelection]);

  // Prevent scroll when in full-screen mode
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullScreen]);

  const containerClassName = isFullScreen
    ? 'fixed inset-0 z-50 bg-dark-950'
    : 'glass rounded-2xl overflow-hidden';

  return (
    <>
      <motion.div
        layout
        className={containerClassName}
        initial={false}
        animate={{
          scale: isFullScreen ? 1 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-dark-700 flex items-center justify-between bg-dark-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-dark-50 flex items-center gap-2">
              <Play className="w-4 h-4 text-primary-400" />
              {title}
            </h3>
            <span className="text-xs text-dark-400 flex items-center gap-1">
              <MousePointer2 className="w-3 h-3" />
              Click nodes to explore
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Full-screen toggle */}
            <button
              onClick={toggleFullScreen}
              className="p-2 rounded-lg text-dark-400 hover:text-dark-50 hover:bg-dark-700 transition-colors"
              title={isFullScreen ? 'Exit full screen (Esc)' : 'Full screen'}
            >
              {isFullScreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Diagram */}
        <div className={`relative ${isFullScreen ? 'h-[calc(100vh-65px)]' : 'h-[400px]'}`} style={{ background: 'rgba(15, 23, 42, 0.5)' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{
              padding: 0.2,
              minZoom: 0.5,
              maxZoom: 1.5,
            }}
            attributionPosition="bottom-left"
            proOptions={{ hideAttribution: true }}
            minZoom={0.3}
            maxZoom={2}
            defaultEdgeOptions={{
              type: 'default',
              animated: true,
            }}
          >
            <Background color="#334155" gap={20} />
            {isFullScreen && (
              <MiniMap
                nodeColor={(node) => (node.data?.color as string) || '#64748b'}
                maskColor="rgba(15, 23, 42, 0.8)"
                className="!bg-dark-800 !rounded-lg"
              />
            )}
          </ReactFlow>
          {/* Custom zoom controls */}
          <CustomZoomControls chapterColor={chapterColor} />
        </div>

        {/* Legend (only in full-screen) */}
        <AnimatePresence>
          {isFullScreen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 glass rounded-lg p-3 text-xs"
            >
              <div className="text-dark-400 mb-2 font-medium">Legend</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-slate-500" />
                  <span className="text-dark-300">Input</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: chapterColor }} />
                  <span className="text-dark-300">Process</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="text-dark-300">Output</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Node detail panel */}
      <NodeDetailPanel />
    </>
  );
}

// Wrap with ReactFlowProvider so useReactFlow is available in custom controls
export default function InteractiveDiagram(props: InteractiveDiagramProps) {
  return (
    <ReactFlowProvider>
      <InteractiveDiagramInner {...props} />
    </ReactFlowProvider>
  );
}
