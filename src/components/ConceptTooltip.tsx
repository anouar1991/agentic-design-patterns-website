/**
 * ConceptTooltip
 *
 * Shows a rich tooltip for concepts when hovered.
 * If this is the first appearance of a concept, shows a more detailed explanation.
 */

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ExternalLink, BookOpen } from 'lucide-react';
import { concepts, isFirstAppearance } from '../data/concepts';

interface ConceptTooltipProps {
  conceptId: string;
  chapterNumber: number;
  children: ReactNode;
}

export default function ConceptTooltip({
  conceptId,
  chapterNumber,
  children,
}: ConceptTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const concept = concepts[conceptId];

  if (!concept) {
    return <>{children}</>;
  }

  const isFirst = isFirstAppearance(conceptId, chapterNumber);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-80 left-1/2 -translate-x-1/2 mt-2"
          >
            {/* Arrow */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-dark-800 rotate-45 border-l border-t border-dark-600" />

            {/* Tooltip content */}
            <div className="relative glass rounded-xl overflow-hidden border border-dark-600 shadow-xl">
              {/* Header */}
              <div className="px-4 py-3 border-b border-dark-700 bg-dark-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isFirst && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 text-xs">
                        <Sparkles className="w-3 h-3" />
                        New
                      </span>
                    )}
                    <h4 className="font-semibold text-white">{concept.name}</h4>
                  </div>
                  <BookOpen className="w-4 h-4 text-dark-400" />
                </div>
              </div>

              {/* Content */}
              <div className="px-4 py-3 max-h-64 overflow-y-auto">
                {isFirst ? (
                  // Full explanation on first appearance
                  <div className="text-sm text-dark-200 space-y-2">
                    <p className="font-medium text-white">
                      {concept.shortDescription}
                    </p>
                    <div className="whitespace-pre-line text-dark-300 text-xs leading-relaxed">
                      {concept.fullExplanation}
                    </div>
                  </div>
                ) : (
                  // Brief description on subsequent appearances
                  <p className="text-sm text-dark-200">
                    {concept.shortDescription}
                  </p>
                )}

                {/* Related concepts */}
                {concept.relatedConcepts && concept.relatedConcepts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-dark-700">
                    <div className="text-xs text-dark-400 mb-2">Related:</div>
                    <div className="flex flex-wrap gap-1">
                      {concept.relatedConcepts.slice(0, 3).map((relatedId) => {
                        const related = concepts[relatedId];
                        if (!related) return null;
                        return (
                          <span
                            key={relatedId}
                            className="px-2 py-0.5 rounded bg-dark-700 text-dark-300 text-xs"
                          >
                            {related.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* External links */}
                {concept.externalLinks && concept.externalLinks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-dark-700">
                    <div className="space-y-1">
                      {concept.externalLinks.slice(0, 2).map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
