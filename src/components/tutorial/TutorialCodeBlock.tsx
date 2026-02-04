/**
 * TutorialCodeBlock
 *
 * Renders code with clickable terms that open the CodeTermModal.
 * Terms are highlighted and show a tooltip on hover.
 */

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, HelpCircle } from 'lucide-react';
import { codeTerms, type CodeTerm } from '../../data/codeTerms';
import CodeTermModal from './CodeTermModal';

interface TutorialCodeBlockProps {
  code: string;
  language?: string;
  chapterColor?: string;
  /** List of term IDs that should be clickable in this code block */
  highlightTerms?: string[];
  /** Line range to highlight [start, end] (1-indexed) */
  highlightLines?: [number, number] | null;
}

// Map of terms to find in code (pattern -> term ID)
const termPatterns: Array<{ pattern: RegExp; termId: string }> = [
  // Imports / Modules
  { pattern: /\blangchain_openai\b/g, termId: 'langchain_openai' },
  { pattern: /\blangchain_core\.prompts\b/g, termId: 'langchain_core.prompts' },
  { pattern: /\blangchain_core\.output_parsers\b/g, termId: 'langchain_core.output_parsers' },
  { pattern: /\blangchain_core\.runnables\b/g, termId: 'langchain_core.runnables' },
  { pattern: /\blangchain_google_genai\b/g, termId: 'langchain_google_genai' },
  { pattern: /\bgoogle\.adk\.agents\b/g, termId: 'google.adk.agents' },
  { pattern: /\bgoogle\.adk\.tools\.mcp_tool\b/g, termId: 'MCPToolset' },
  { pattern: /\bgoogle\.adk\.callbacks\b/g, termId: 'CallbackContext' },
  { pattern: /\bgoogle\.adk\.models\.llm\b/g, termId: 'LlmRequest' },
  { pattern: /\bgoogle\.adk\.tools\.base_tool\b/g, termId: 'BaseTool' },
  { pattern: /\bgoogle\.adk\.tools\.tool_context\b/g, termId: 'tool-context' },
  { pattern: /\bgoogle\.adk\.code_executors\b/g, termId: 'code-executor' },
  { pattern: /\bgoogle\.generativeai\b/g, termId: 'generative-ai' },
  { pattern: /\bimport asyncio\b/g, termId: 'asyncio' },

  // LangChain classes
  { pattern: /\bChatOpenAI\b/g, termId: 'ChatOpenAI' },
  { pattern: /\bChatGoogleGenerativeAI\b/g, termId: 'ChatGoogleGenerativeAI' },
  { pattern: /\bChatPromptTemplate\b/g, termId: 'ChatPromptTemplate' },
  { pattern: /\bStrOutputParser\b/g, termId: 'StrOutputParser' },
  { pattern: /\bRunnablePassthrough\b/g, termId: 'RunnablePassthrough' },
  { pattern: /\bRunnableParallel\b/g, termId: 'RunnableParallel' },
  { pattern: /\bRunnableBranch\b/g, termId: 'RunnableBranch' },
  { pattern: /\bPromptTemplate\b/g, termId: 'PromptTemplate' },
  { pattern: /\bLLMChain\b/g, termId: 'LLMChain' },
  { pattern: /\bSequentialChain\b/g, termId: 'SequentialChain' },
  { pattern: /\bAgentExecutor\b/g, termId: 'AgentExecutor' },
  { pattern: /\bConversationBufferMemory\b/g, termId: 'ConversationBufferMemory' },
  { pattern: /\bRecursiveCharacterTextSplitter\b/g, termId: 'RecursiveCharacterTextSplitter' },

  // Google ADK classes
  { pattern: /\bSequentialAgent\b/g, termId: 'SequentialAgent' },
  { pattern: /\bParallelAgent\b/g, termId: 'ParallelAgent' },
  { pattern: /\bLlmAgent\b/g, termId: 'LlmAgent' },
  { pattern: /\bCallbackContext\b/g, termId: 'CallbackContext' },
  { pattern: /\bLlmRequest\b/g, termId: 'LlmRequest' },
  { pattern: /\bMCPToolset\b/g, termId: 'MCPToolset' },
  { pattern: /\bToolContext\b/g, termId: 'tool-context' },
  { pattern: /\bBuiltInCodeExecutor\b/g, termId: 'code-executor' },
  { pattern: /\bBaseAgent\b/g, termId: 'base-agent' },
  { pattern: /\bAgentTool\b/g, termId: 'agent-tool' },

  // CrewAI / Pydantic classes
  { pattern: /\bBaseModel\b/g, termId: 'pydantic-model' },
  { pattern: /\bField\(/g, termId: 'Field' },
  { pattern: /\bCrew\(/g, termId: 'Crew' },
  { pattern: /\bProcess\./g, termId: 'Process' },
  { pattern: /\bcreate_tool_calling_agent\b/g, termId: 'create_tool_calling_agent' },

  // MCP / FastMCP
  { pattern: /\bFastMCP\b/g, termId: 'FastMCP' },

  // A2A protocol
  { pattern: /\bAgentCard\b/g, termId: 'AgentCard' },
  { pattern: /\bAgentSkill\b/g, termId: 'AgentSkill' },

  // LangGraph
  { pattern: /\bStateGraph\b/g, termId: 'state-graph' },
  { pattern: /\bInMemoryStore\b/g, termId: 'InMemoryStore' },

  // Methods
  { pattern: /\.from_template\b/g, termId: 'from_template' },
  { pattern: /\.from_messages\b/g, termId: 'from_messages' },
  { pattern: /\.invoke\b/g, termId: 'invoke' },
  { pattern: /\.ainvoke\b/g, termId: 'ainvoke' },
  { pattern: /\.add_conditional_edges\b/g, termId: 'conditional-edges' },

  // Decorators
  { pattern: /^@tool\b/gm, termId: 'tool_decorator' },

  // Parameters
  { pattern: /\btemperature\s*=/g, termId: 'temperature' },
  { pattern: /\bbefore_tool_callback\s*=/g, termId: 'before-tool-callback' },
  { pattern: /\bsub_agents\s*=/g, termId: 'sub_agents' },
  { pattern: /\binstruction\s*=/g, termId: 'instruction' },
];

interface CodeToken {
  type: 'text' | 'term' | 'comment' | 'string' | 'keyword' | 'operator';
  content: string;
  termId?: string;
  lineNumber?: number;
}

function tokenizeCode(code: string, highlightTerms?: string[]): CodeToken[][] {
  const lines = code.split('\n');
  const result: CodeToken[][] = [];

  lines.forEach((line, lineIndex) => {
    const lineTokens: CodeToken[] = [];
    let remaining = line;
    let position = 0;

    while (remaining.length > 0) {
      let matched = false;

      // Check for comments first
      const commentMatch = remaining.match(/^#.*/);
      if (commentMatch) {
        lineTokens.push({
          type: 'comment',
          content: commentMatch[0],
          lineNumber: lineIndex + 1,
        });
        break;
      }

      // Check for strings
      const stringMatch = remaining.match(/^(["'])((?:\\.|(?!\1)[^\\])*)\1/) ||
                          remaining.match(/^("""|''')([\s\S]*?)\1/);
      if (stringMatch) {
        lineTokens.push({
          type: 'string',
          content: stringMatch[0],
          lineNumber: lineIndex + 1,
        });
        remaining = remaining.slice(stringMatch[0].length);
        position += stringMatch[0].length;
        matched = true;
        continue;
      }

      // Check for term patterns
      for (const { pattern, termId } of termPatterns) {
        if (highlightTerms && !highlightTerms.includes(termId)) continue;

        pattern.lastIndex = 0;
        const match = pattern.exec(remaining);
        if (match && match.index === 0) {
          lineTokens.push({
            type: 'term',
            content: match[0],
            termId,
            lineNumber: lineIndex + 1,
          });
          remaining = remaining.slice(match[0].length);
          position += match[0].length;
          matched = true;
          break;
        }
      }

      if (matched) continue;

      // Check for pipe operator
      if (remaining.startsWith('|')) {
        lineTokens.push({
          type: 'operator',
          content: '|',
          termId: 'pipe_operator',
          lineNumber: lineIndex + 1,
        });
        remaining = remaining.slice(1);
        position += 1;
        continue;
      }

      // Check for keywords
      const keywordMatch = remaining.match(/^(from|import|def|class|return|if|else|for|in|and|or|not|True|False|None|async|await)\b/);
      if (keywordMatch) {
        lineTokens.push({
          type: 'keyword',
          content: keywordMatch[0],
          lineNumber: lineIndex + 1,
        });
        remaining = remaining.slice(keywordMatch[0].length);
        position += keywordMatch[0].length;
        continue;
      }

      // Default: take one character as text
      lineTokens.push({
        type: 'text',
        content: remaining[0],
        lineNumber: lineIndex + 1,
      });
      remaining = remaining.slice(1);
      position += 1;
    }

    result.push(lineTokens);
  });

  return result;
}

export default function TutorialCodeBlock({
  code,
  language = 'python',
  chapterColor = '#f59e0b',
  highlightTerms,
  highlightLines,
}: TutorialCodeBlockProps) {
  const [selectedTerm, setSelectedTerm] = useState<CodeTerm | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredTermId, setHoveredTermId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const tokenizedLines = useMemo(
    () => tokenizeCode(code, highlightTerms),
    [code, highlightTerms]
  );

  const hasClickableTerms = useMemo(
    () => tokenizedLines.some(line => line.some(t => t.type === 'term' || t.type === 'operator')),
    [tokenizedLines]
  );

  const handleTermClick = useCallback((termId: string) => {
    const term = codeTerms[termId];
    if (term) {
      setSelectedTerm(term);
      setIsModalOpen(true);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const renderToken = (token: CodeToken, index: number) => {
    switch (token.type) {
      case 'term':
      case 'operator':
        const isHovered = hoveredTermId === token.termId;
        return (
          <span
            key={index}
            role="button"
            tabIndex={0}
            aria-label={`Learn about ${token.content.replace(/[.()=]/g, '')}`}
            className="relative cursor-pointer transition-all duration-150 rounded px-0.5 -mx-0.5"
            style={{
              backgroundColor: isHovered ? `${chapterColor}30` : 'transparent',
              borderBottom: `2px dashed ${chapterColor}`,
            }}
            onClick={() => token.termId && handleTermClick(token.termId)}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && token.termId) {
                e.preventDefault();
                handleTermClick(token.termId);
              }
            }}
            onMouseEnter={() => setHoveredTermId(token.termId || null)}
            onMouseLeave={() => setHoveredTermId(null)}
            onFocus={() => setHoveredTermId(token.termId || null)}
            onBlur={() => setHoveredTermId(null)}
          >
            {token.content}
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap z-10"
                style={{ backgroundColor: chapterColor, color: '#000' }}
              >
                <HelpCircle className="w-3 h-3 inline mr-1" />
                Click to learn more
              </motion.span>
            )}
          </span>
        );

      case 'comment':
        return (
          <span key={index} className="text-dark-500 italic">
            {token.content}
          </span>
        );

      case 'string':
        return (
          <span key={index} className="text-green-400">
            {token.content}
          </span>
        );

      case 'keyword':
        return (
          <span key={index} className="text-purple-400 font-semibold">
            {token.content}
          </span>
        );

      default:
        return <span key={index}>{token.content}</span>;
    }
  };

  return (
    <>
      <div className="glass rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-dark-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${chapterColor}15`,
                color: chapterColor,
                border: `1px solid ${chapterColor}25`,
              }}
            >
              {language}
            </span>
            {hasClickableTerms && (
              <span className="text-xs text-dark-500 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                Click highlighted terms for explanations
              </span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-dark-700/80"
            style={{ color: copied ? '#4ade80' : '#8c9bb5' }}
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

        {/* Code */}
        <div className="p-4 overflow-x-auto">
          <pre className="font-mono text-sm leading-relaxed">
            <code>
              {tokenizedLines.map((lineTokens, lineIndex) => {
                const lineNum = lineIndex + 1;
                const isLineHighlighted =
                  highlightLines &&
                  lineNum >= highlightLines[0] &&
                  lineNum <= highlightLines[1];

                return (
                  <div
                    key={lineIndex}
                    className="flex transition-colors duration-300"
                    style={{
                      backgroundColor: isLineHighlighted
                        ? `${chapterColor}12`
                        : 'transparent',
                      borderLeft: isLineHighlighted
                        ? `3px solid ${chapterColor}`
                        : '3px solid transparent',
                      paddingLeft: isLineHighlighted ? '0.25rem' : '0.25rem',
                    }}
                  >
                    <span
                      className="select-none w-10 text-right pr-4 flex-shrink-0 text-dark-600"
                      style={{ fontSize: '0.8rem', lineHeight: 'inherit' }}
                    >
                      {lineNum}
                    </span>
                    <span className="text-dark-200">
                      {lineTokens.length === 0 ? '\n' : lineTokens.map(renderToken)}
                    </span>
                  </div>
                );
              })}
            </code>
          </pre>
        </div>
      </div>

      {/* Term Modal */}
      <CodeTermModal
        term={selectedTerm}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chapterColor={chapterColor}
      />
    </>
  );
}
