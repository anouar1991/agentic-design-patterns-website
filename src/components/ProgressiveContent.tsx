/**
 * ProgressiveContent
 *
 * Reveals content sections progressively as the user scrolls.
 * Supports different section types (narrative, code, explanation, tip, warning).
 */

import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Lightbulb, AlertTriangle, BookOpen, Code, FileCode, Dumbbell } from 'lucide-react';
import type { ContentSection } from '../data/types';
import ConceptTooltip from './ConceptTooltip';

interface ProgressiveContentProps {
  sections: ContentSection[];
  chapterColor: string;
  chapterNumber: number;
  highlightedLines?: [number, number] | null;
}

// Section type styling
const sectionStyles = {
  narrative: {
    icon: BookOpen,
    bgClass: 'bg-transparent',
    borderClass: '',
    textClass: 'text-dark-200',
  },
  code: {
    icon: Code,
    bgClass: 'bg-dark-800/50',
    borderClass: 'border border-dark-700',
    textClass: '',
  },
  explanation: {
    icon: FileCode,
    bgClass: 'bg-dark-800/30',
    borderClass: 'border-l-4 border-primary-500/50',
    textClass: 'text-dark-300',
  },
  tip: {
    icon: Lightbulb,
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border border-emerald-500/30',
    textClass: 'text-emerald-200',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-amber-500/10',
    borderClass: 'border border-amber-500/30',
    textClass: 'text-amber-200',
  },
  exercise: {
    icon: Dumbbell,
    bgClass: 'bg-purple-500/10',
    borderClass: 'border border-purple-500/30',
    textClass: 'text-purple-200',
  },
};

// Animation variants
const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

export default function ProgressiveContent({
  sections,
  chapterColor,
  chapterNumber,
  highlightedLines,
}: ProgressiveContentProps) {
  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        const sectionType = section.type || 'narrative';
        const style = sectionStyles[sectionType];
        const Icon = style.icon;
        const sectionContent = section.content || section.code || '';

        return (
          <motion.div
            key={index}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            className={`rounded-xl ${style.bgClass} ${style.borderClass}`}
          >
            {/* Section header for non-narrative types */}
            {sectionType !== 'narrative' && sectionType !== 'code' && (
              <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                <Icon
                  className="w-4 h-4"
                  style={{
                    color:
                      sectionType === 'tip'
                        ? '#10b981'
                        : sectionType === 'warning'
                        ? '#f59e0b'
                        : sectionType === 'exercise'
                        ? '#a855f7'
                        : chapterColor,
                  }}
                />
                <span className="text-xs font-medium uppercase tracking-wide text-dark-400">
                  {sectionType === 'explanation' ? 'How it works' : sectionType}
                </span>
              </div>
            )}

            {/* Content */}
            {sectionType === 'code' ? (
              <div className="overflow-hidden rounded-xl">
                <SyntaxHighlighter
                  language={section.language || 'python'}
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    background: 'transparent',
                    fontSize: '0.875rem',
                  }}
                  showLineNumbers
                  wrapLines
                  lineProps={(lineNumber) => {
                    const isHighlighted =
                      highlightedLines &&
                      lineNumber >= highlightedLines[0] &&
                      lineNumber <= highlightedLines[1];
                    return {
                      style: {
                        display: 'block',
                        backgroundColor: isHighlighted
                          ? `${chapterColor}20`
                          : 'transparent',
                        borderLeft: isHighlighted
                          ? `3px solid ${chapterColor}`
                          : '3px solid transparent',
                        paddingLeft: '0.5rem',
                        marginLeft: '-0.5rem',
                      },
                    };
                  }}
                >
                  {sectionContent}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div
                className={`px-4 ${
                  sectionType === 'narrative' ? 'py-0' : 'pb-4'
                } ${style.textClass}`}
              >
                <ContentWithConcepts
                  content={sectionContent}
                  conceptIds={section.conceptsIntroduced || section.concepts || []}
                  chapterNumber={chapterNumber}
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * Renders content with concept tooltips for marked terms
 */
function ContentWithConcepts({
  content,
  conceptIds,
  chapterNumber,
}: {
  content: string;
  conceptIds: string[];
  chapterNumber: number;
}) {
  // Simple markdown-like rendering with concept tooltips
  // In a real implementation, you'd use a proper markdown parser

  // Split content by potential concept markers (words in backticks)
  const parts = content.split(/(`[^`]+`)/g);

  return (
    <p className="leading-relaxed">
      {parts.map((part, index) => {
        // Check if this is a backtick-wrapped term
        if (part.startsWith('`') && part.endsWith('`')) {
          const term = part.slice(1, -1);
          // Check if it's a concept we should show a tooltip for
          const conceptId = conceptIds.find((id) =>
            term.toLowerCase().includes(id.replace(/-/g, ' '))
          );

          if (conceptId) {
            return (
              <ConceptTooltip
                key={index}
                conceptId={conceptId}
                chapterNumber={chapterNumber}
              >
                <code className="px-1.5 py-0.5 rounded bg-dark-700 text-primary-300 text-sm cursor-help">
                  {term}
                </code>
              </ConceptTooltip>
            );
          }

          return (
            <code
              key={index}
              className="px-1.5 py-0.5 rounded bg-dark-700 text-dark-200 text-sm"
            >
              {term}
            </code>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </p>
  );
}
