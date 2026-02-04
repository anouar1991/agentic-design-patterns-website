/**
 * EnhancedCodeBlock
 *
 * A premium code block wrapper around react-syntax-highlighter with:
 * - Language badge
 * - Copy-to-clipboard with animated feedback
 * - Line numbers (via SyntaxHighlighter)
 * - Line highlighting support
 * - Glass morphism styling matching the design system
 */

import { memo, useState, useCallback } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';

SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);
import { Copy, Check, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedCodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  chapterColor?: string;
  highlightedLines?: [number, number] | number[] | null;
  showLineNumbers?: boolean;
  explanation?: string;
  /** Optional ref callback for scroll-to-code linking */
  refCallback?: (el: HTMLDivElement | null) => void;
  /** Extra class for outer wrapper */
  className?: string;
}

// Custom syntax theme based on oneDark but with refined colors
const enhancedTheme = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: 'transparent',
    margin: 0,
    padding: '1.5rem',
    fontSize: '0.875rem',
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: 'transparent',
  },
};

const EnhancedCodeBlock = memo(function EnhancedCodeBlock({
  code,
  language = 'python',
  title,
  chapterColor = '#0d96e6',
  highlightedLines,
  showLineNumbers = true,
  explanation,
  refCallback,
  className = '',
}: EnhancedCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  const hasHighlight = highlightedLines !== null && highlightedLines !== undefined && highlightedLines.length >= 2;
  const hlStart = highlightedLines ? highlightedLines[0] : 0;
  const hlEnd = highlightedLines ? highlightedLines[1] : 0;

  const lineProps = useCallback((lineNumber: number) => {
    const isHighlighted =
      hasHighlight &&
      lineNumber >= hlStart &&
      lineNumber <= hlEnd;
    return {
      style: {
        display: 'block' as const,
        backgroundColor: isHighlighted
          ? `${chapterColor}15`
          : 'transparent',
        borderLeft: isHighlighted
          ? `3px solid ${chapterColor}`
          : '3px solid transparent',
        paddingLeft: '0.5rem',
        marginLeft: '-0.5rem',
        transition: 'all 0.3s ease',
      },
    };
  }, [hasHighlight, hlStart, hlEnd, chapterColor]);

  return (
    <div
      ref={refCallback}
      className={`glass glass-code rounded-2xl overflow-hidden transition-all duration-300 ${
        hasHighlight ? 'ring-2 ring-offset-2 ring-offset-[#1e293b]' : ''
      } ${className}`}
      style={{
        // @ts-expect-error CSS custom property for ring color
        '--tw-ring-color': hasHighlight ? chapterColor : 'transparent',
      }}
    >
      {/* Header with title, language badge, and copy button */}
      <div className="px-4 py-3 border-b border-dark-700/60 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {title && (
            <h3 className="font-semibold text-dark-50 flex items-center gap-2 truncate">
              <FileCode className="w-4 h-4 flex-shrink-0" style={{ color: chapterColor }} />
              <span className="truncate">{title}</span>
            </h3>
          )}
          {/* Language badge */}
          <span
            className="px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider flex-shrink-0"
            style={{
              backgroundColor: `${chapterColor}15`,
              color: chapterColor,
              border: `1px solid ${chapterColor}25`,
            }}
          >
            {language}
          </span>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-dark-700/80 flex-shrink-0"
          style={{
            color: copied ? '#4ade80' : '#8c9bb5',
          }}
          aria-label={copied ? 'Copied to clipboard' : 'Copy code'}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Code block */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={enhancedTheme}
          showLineNumbers={showLineNumbers}
          wrapLines
          lineNumberStyle={{
            minWidth: '2.5rem',
            paddingRight: '1rem',
            color: '#455268',
            fontSize: '0.8rem',
            userSelect: 'none',
          }}
          lineProps={lineProps}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* Explanation footer */}
      {explanation && (
        <div className="px-4 py-3 bg-dark-800/50 border-t border-dark-700/60">
          <p className="text-sm text-dark-300 leading-relaxed">
            <span className="font-medium text-dark-50">Explanation: </span>
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
});

export default EnhancedCodeBlock;
