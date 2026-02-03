/**
 * DiagramContext
 *
 * Manages interactive state for the chapter diagram system:
 * - Selected node tracking
 * - Code highlight coordination
 * - Full-screen mode toggle
 * - Detail panel visibility
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { DiagramNode } from '../data/types';

interface DiagramContextType {
  // Selected node state
  selectedNodeId: string | null;
  selectedNode: DiagramNode | null;
  selectNode: (node: DiagramNode | null) => void;
  clearSelection: () => void;

  // Detail panel state
  isDetailPanelOpen: boolean;
  openDetailPanel: () => void;
  closeDetailPanel: () => void;

  // Full-screen mode
  isFullScreen: boolean;
  toggleFullScreen: () => void;

  // Code highlighting
  highlightedCodeLines: number[] | null;
  highlightCodeLines: (lines: number[] | null) => void;
  scrollToCodeExample: (index: number) => void;
  setScrollToCodeCallback: (callback: (index: number) => void) => void;

  // Node hover state (for highlighting connections)
  hoveredNodeId: string | null;
  setHoveredNodeId: (id: string | null) => void;
}

const DiagramContext = createContext<DiagramContextType | null>(null);

export function DiagramProvider({ children }: { children: ReactNode }) {
  // Selected node
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);

  // Panel and display states
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Code highlighting
  const [highlightedCodeLines, setHighlightedCodeLines] = useState<number[] | null>(null);
  const [scrollToCodeCallback, setScrollToCodeCallbackInternal] = useState<((index: number) => void) | null>(null);

  // Hover state
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const selectNode = useCallback((node: DiagramNode | null) => {
    if (node) {
      setSelectedNodeId(node.id);
      setSelectedNode(node);
      setIsDetailPanelOpen(true);

      // If node has code highlight info, apply it
      if (node.data.codeHighlightLines) {
        setHighlightedCodeLines(node.data.codeHighlightLines);
      }
    } else {
      setSelectedNodeId(null);
      setSelectedNode(null);
      setIsDetailPanelOpen(false);
      setHighlightedCodeLines(null);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedNode(null);
    setIsDetailPanelOpen(false);
    setHighlightedCodeLines(null);
  }, []);

  const openDetailPanel = useCallback(() => setIsDetailPanelOpen(true), []);
  const closeDetailPanel = useCallback(() => setIsDetailPanelOpen(false), []);

  const toggleFullScreen = useCallback(() => setIsFullScreen(prev => !prev), []);

  const highlightCodeLines = useCallback((lines: number[] | null) => {
    setHighlightedCodeLines(lines);
  }, []);

  const scrollToCodeExample = useCallback((index: number) => {
    if (scrollToCodeCallback) {
      scrollToCodeCallback(index);
    }
  }, [scrollToCodeCallback]);

  const setScrollToCodeCallback = useCallback((callback: (index: number) => void) => {
    setScrollToCodeCallbackInternal(() => callback);
  }, []);

  const value: DiagramContextType = {
    selectedNodeId,
    selectedNode,
    selectNode,
    clearSelection,
    isDetailPanelOpen,
    openDetailPanel,
    closeDetailPanel,
    isFullScreen,
    toggleFullScreen,
    highlightedCodeLines,
    highlightCodeLines,
    scrollToCodeExample,
    setScrollToCodeCallback,
    hoveredNodeId,
    setHoveredNodeId,
  };

  return (
    <DiagramContext.Provider value={value}>
      {children}
    </DiagramContext.Provider>
  );
}

export function useDiagram() {
  const context = useContext(DiagramContext);
  if (!context) {
    throw new Error('useDiagram must be used within a DiagramProvider');
  }
  return context;
}

// Optional hook that doesn't throw - useful for components that may be outside provider
export function useDiagramOptional() {
  return useContext(DiagramContext);
}
