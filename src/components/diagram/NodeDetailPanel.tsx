/**
 * NodeDetailPanel
 *
 * A slide-out panel that shows detailed information about a selected diagram node.
 * Features:
 * - Smooth slide-in animation from the right
 * - Node metadata display (role, description, hints)
 * - "View in Code" button that scrolls to and highlights relevant code
 * - Related concepts list
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, BookOpen, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';
import { useDiagram } from '../../contexts/DiagramContext';
import { concepts } from '../../data/concepts';
import type { NodeRole } from '../../data/types';

// Role display names
const roleNames: Record<NodeRole, string> = {
  input: 'Input',
  process: 'Process',
  output: 'Output',
  decision: 'Decision',
  handler: 'Handler',
  tool: 'Tool',
  agent: 'Agent',
  memory: 'Memory',
};

// Role descriptions
const roleDescriptions: Record<NodeRole, string> = {
  input: 'Entry point that receives initial data',
  process: 'Transforms or processes data',
  output: 'Produces final results',
  decision: 'Routes flow based on conditions',
  handler: 'Handles specific types of requests',
  tool: 'Performs specific actions or retrieves data',
  agent: 'Autonomous entity that makes decisions',
  memory: 'Stores and retrieves contextual information',
};

export default function NodeDetailPanel() {
  const {
    selectedNode,
    isDetailPanelOpen,
    closeDetailPanel,
    scrollToCodeExample,
  } = useDiagram();

  if (!selectedNode) return null;

  const { data } = selectedNode;
  const role = data.role || 'process';
  const color = data.color || '#f59e0b';
  const hasCodeLink = data.codeExampleIndex !== undefined;
  const conceptIds = data.conceptIds || [];

  const handleViewCode = () => {
    if (data.codeExampleIndex !== undefined) {
      scrollToCodeExample(data.codeExampleIndex);
      // Keep panel open so user sees connection
    }
  };

  return (
    <AnimatePresence>
      {isDetailPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeDetailPanel}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-900 border-l border-dark-700 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div
              className="sticky top-0 p-4 border-b border-dark-700 backdrop-blur-md bg-dark-900/90"
              style={{ borderTopColor: color }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Sparkles className="w-5 h-5" style={{ color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{data.label}</h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      {roleNames[role]}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeDetailPanel}
                  className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* Description */}
              {data.description && (
                <div>
                  <p className="text-dark-300">{data.description}</p>
                </div>
              )}

              {/* Role explanation */}
              <div className="glass rounded-xl p-4">
                <h4 className="text-sm font-medium text-dark-400 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  About this step
                </h4>
                <p className="text-sm text-dark-200">{roleDescriptions[role]}</p>
              </div>

              {/* Detailed hint */}
              {data.detailedHint && (
                <div className="glass rounded-xl p-4 border-l-4" style={{ borderLeftColor: color }}>
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" style={{ color }} />
                    How it works
                  </h4>
                  <p className="text-sm text-dark-200 whitespace-pre-line">
                    {data.detailedHint}
                  </p>
                </div>
              )}

              {/* View in Code button */}
              {hasCodeLink && (
                <motion.button
                  onClick={handleViewCode}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-white font-medium transition-colors"
                  style={{ backgroundColor: `${color}20`, borderColor: color }}
                >
                  <span className="flex items-center gap-2">
                    <Code className="w-5 h-5" style={{ color }} />
                    View in Code
                  </span>
                  <ArrowRight className="w-4 h-4" style={{ color }} />
                </motion.button>
              )}

              {/* Related concepts */}
              {conceptIds.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-dark-400 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Related Concepts
                  </h4>
                  <div className="space-y-2">
                    {conceptIds.map((conceptId) => {
                      const concept = concepts[conceptId];
                      if (!concept) return null;
                      return (
                        <div
                          key={conceptId}
                          className="glass rounded-lg p-3 hover:bg-dark-700/50 transition-colors cursor-pointer"
                        >
                          <div className="text-sm font-medium text-white">
                            {concept.name}
                          </div>
                          <div className="text-xs text-dark-400 mt-0.5">
                            {concept.shortDescription}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Code highlight info */}
              {data.codeHighlightLines && (
                <div className="text-xs text-dark-500 flex items-center gap-2">
                  <Code className="w-3 h-3" />
                  Lines {data.codeHighlightLines[0]}-{data.codeHighlightLines[1]}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
