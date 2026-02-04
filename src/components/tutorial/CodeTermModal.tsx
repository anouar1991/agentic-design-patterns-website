/**
 * CodeTermModal
 *
 * A modal that displays detailed information about a code term.
 * Shows when users click on highlighted terms in code examples.
 *
 * Features:
 * - Full term documentation
 * - Syntax highlighting for examples
 * - Parameter tables
 * - Related links
 */

import { memo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Lightbulb, Code, BookOpen, ArrowRight } from 'lucide-react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';

SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);
import type { CodeTerm } from '../../data/codeTerms';

interface CodeTermModalProps {
  term: CodeTerm | null;
  isOpen: boolean;
  onClose: () => void;
  chapterColor?: string;
}

// Type badge colors
const typeColors: Record<CodeTerm['type'], { bg: string; text: string }> = {
  class: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  function: { bg: 'bg-green-500/20', text: 'text-green-400' },
  method: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  operator: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  module: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  parameter: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  concept: { bg: 'bg-pink-500/20', text: 'text-pink-400' },
};

const CodeTermModal = memo(function CodeTermModal({
  term,
  isOpen,
  onClose,
  chapterColor = '#f59e0b'
}: CodeTermModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Escape key handler and focus trap
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    // Focus trap: keep Tab within modal
    if (e.key === 'Tab' && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose]);

  // Store previous focus and manage focus on open/close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleKeyDown);
      // Focus the close button after animation
      setTimeout(() => {
        const closeBtn = modalRef.current?.querySelector<HTMLElement>('button');
        closeBtn?.focus();
      }, 100);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (!isOpen && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!term) return null;

  const typeStyle = typeColors[term.type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Documentation for ${term.name}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] overflow-hidden bg-dark-900 border border-dark-700 rounded-2xl shadow-2xl z-50"
          >
            {/* Header */}
            <div
              className="sticky top-0 p-4 border-b border-dark-700 bg-dark-900/95 backdrop-blur-sm"
              style={{ borderTopColor: chapterColor, borderTopWidth: 3 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}>
                      {term.type}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-dark-50 font-mono truncate">
                    {term.name}
                  </h2>
                  <p className="text-sm text-dark-400 mt-1">
                    {term.shortDescription}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close documentation"
                  className="p-2 rounded-lg text-dark-400 hover:text-dark-50 hover:bg-dark-800 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)] space-y-5">
              {/* Full Description */}
              <div>
                <p className="text-dark-200 leading-relaxed">
                  {term.fullDescription}
                </p>
              </div>

              {/* Syntax */}
              {term.syntax && (
                <div className="glass rounded-xl overflow-hidden">
                  <div className="px-3 py-2 border-b border-dark-700 flex items-center gap-2">
                    <Code className="w-4 h-4 text-dark-400" />
                    <span className="text-xs font-medium text-dark-400 uppercase tracking-wide">
                      Syntax
                    </span>
                  </div>
                  <SyntaxHighlighter
                    language="python"
                    style={oneDark}
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      background: 'transparent',
                      fontSize: '0.875rem',
                    }}
                  >
                    {term.syntax}
                  </SyntaxHighlighter>
                </div>
              )}

              {/* Parameters */}
              {term.parameters && term.parameters.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-dark-50 mb-3 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" style={{ color: chapterColor }} />
                    Parameters
                  </h3>
                  <div className="space-y-2">
                    {term.parameters.map((param) => (
                      <div
                        key={param.name}
                        className="glass rounded-lg p-3"
                      >
                        <div className="flex items-baseline gap-2 mb-1">
                          <code className="text-sm font-mono font-semibold" style={{ color: chapterColor }}>
                            {param.name}
                          </code>
                          <span className="text-xs text-dark-500 font-mono">
                            {param.type}
                          </span>
                          {param.default && (
                            <span className="text-xs text-dark-500">
                              = {param.default}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-dark-300">
                          {param.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Returns */}
              {term.returns && (
                <div>
                  <h3 className="text-sm font-semibold text-dark-50 mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" style={{ color: chapterColor }} />
                    Returns
                  </h3>
                  <div className="glass rounded-lg p-3">
                    <code className="text-sm font-mono" style={{ color: chapterColor }}>
                      {term.returns.type}
                    </code>
                    <p className="text-sm text-dark-300 mt-1">
                      {term.returns.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Example */}
              {term.example && (
                <div>
                  <h3 className="text-sm font-semibold text-dark-50 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" style={{ color: chapterColor }} />
                    Example
                  </h3>
                  <div className="glass rounded-xl overflow-hidden">
                    <SyntaxHighlighter
                      language="python"
                      style={oneDark}
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: 'transparent',
                        fontSize: '0.875rem',
                      }}
                      showLineNumbers
                    >
                      {term.example}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )}

              {/* Tips */}
              {term.tips && term.tips.length > 0 && (
                <div className="glass rounded-xl p-4 border-l-4" style={{ borderLeftColor: chapterColor }}>
                  <h3 className="text-sm font-semibold text-dark-50 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" style={{ color: chapterColor }} />
                    Pro Tips
                  </h3>
                  <ul className="space-y-2">
                    {term.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-dark-300">
                        <span style={{ color: chapterColor }}>•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Documentation Link */}
              {term.docUrl && (
                <a
                  href={term.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-dark-700"
                  style={{ backgroundColor: `${chapterColor}15`, color: chapterColor }}
                >
                  <ExternalLink className="w-4 h-4" />
                  View Official Documentation
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </a>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

export default CodeTermModal;
