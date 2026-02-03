/**
 * InteractiveTutorial
 *
 * Renders a tutorial with interleaved narrative and code blocks.
 * Code blocks have clickable terms that explain concepts.
 *
 * This is the main component for the tutorial-style learning experience.
 */

import { motion } from 'framer-motion';
import { Lightbulb, AlertTriangle, Rocket, BookOpen, ChevronRight, Dumbbell } from 'lucide-react';
import TutorialCodeBlock from './TutorialCodeBlock';

export interface TutorialStep {
  id?: string;
  type: 'narrative' | 'code' | 'tip' | 'warning' | 'exercise' | 'checkpoint';
  content: string;
  language?: string;
  /** Which term IDs to highlight as clickable in this code block */
  highlightTerms?: string[];
  /** Optional title for the step */
  title?: string;
}

export interface TutorialSection {
  id: string;
  title: string;
  description?: string;
  steps: TutorialStep[];
}

interface InteractiveTutorialProps {
  sections: TutorialSection[];
  chapterColor: string;
}

// Step type styling
const stepStyles = {
  narrative: {
    icon: BookOpen,
    bgClass: 'bg-transparent',
    borderClass: '',
  },
  code: {
    icon: ChevronRight,
    bgClass: '',
    borderClass: '',
  },
  tip: {
    icon: Lightbulb,
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border border-emerald-500/30',
    iconColor: '#10b981',
    label: 'Pro Tip',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-amber-500/10',
    borderClass: 'border border-amber-500/30',
    iconColor: '#f59e0b',
    label: 'Watch Out',
  },
  exercise: {
    icon: Dumbbell,
    bgClass: 'bg-purple-500/10',
    borderClass: 'border border-purple-500/30',
    iconColor: '#a855f7',
    label: 'Try It Yourself',
  },
  checkpoint: {
    icon: Rocket,
    bgClass: 'bg-blue-500/10',
    borderClass: 'border border-blue-500/30',
    iconColor: '#3b82f6',
    label: 'Checkpoint',
  },
};

// Animation variants
const stepVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function InteractiveTutorial({
  sections,
  chapterColor,
}: InteractiveTutorialProps) {
  return (
    <div className="space-y-12">
      {sections.map((section, sectionIndex) => (
        <motion.div
          key={section.id}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: sectionIndex * 0.1 }}
          className="space-y-6"
        >
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: `${chapterColor}20`, color: chapterColor }}
            >
              {sectionIndex + 1}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {section.title}
              </h3>
              {section.description && (
                <p className="text-sm text-dark-400">{section.description}</p>
              )}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4 pl-4 border-l-2 border-dark-700 ml-4">
            {section.steps.map((step, stepIndex) => {
              const style = stepStyles[step.type];
              const Icon = style.icon;

              return (
                <motion.div
                  key={`${section.id}-${stepIndex}`}
                  variants={stepVariants}
                  className={`relative ${style.bgClass} ${style.borderClass} ${
                    step.type !== 'narrative' && step.type !== 'code' ? 'rounded-xl p-4' : ''
                  }`}
                >
                  {/* Connector dot */}
                  <div
                    className="absolute -left-[calc(1rem+5px)] top-2 w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: step.type === 'code' ? chapterColor : (style as any).iconColor || chapterColor,
                    }}
                  />

                  {/* Step content */}
                  {step.type === 'code' ? (
                    <TutorialCodeBlock
                      code={step.content}
                      language={step.language || 'python'}
                      chapterColor={chapterColor}
                      highlightTerms={step.highlightTerms}
                    />
                  ) : step.type === 'narrative' ? (
                    <div className="text-dark-200 leading-relaxed space-y-3">
                      {step.content.split('\n\n').map((paragraph, pIndex) => (
                        <p
                          key={pIndex}
                          dangerouslySetInnerHTML={{
                            __html: paragraph
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                              .replace(/`([^`]+)`/g, `<code class="px-1.5 py-0.5 rounded bg-dark-700 text-sm font-mono" style="color: ${chapterColor}">$1</code>`)
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div>
                      {/* Label for special steps */}
                      <div className="flex items-center gap-2 mb-2">
                        <Icon
                          className="w-4 h-4"
                          style={{ color: (style as any).iconColor }}
                        />
                        <span
                          className="text-xs font-medium uppercase tracking-wide"
                          style={{ color: (style as any).iconColor }}
                        >
                          {(style as any).label}
                        </span>
                      </div>
                      <div className="text-sm leading-relaxed">
                        {step.content.split('\n\n').map((paragraph, pIndex) => (
                          <p
                            key={pIndex}
                            className={pIndex > 0 ? 'mt-2' : ''}
                            style={{ color: step.type === 'tip' ? '#a7f3d0' : step.type === 'warning' ? '#fde68a' : '#e9d5ff' }}
                            dangerouslySetInnerHTML={{
                              __html: paragraph
                                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                                .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-black/20 text-xs font-mono">$1</code>')
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export { TutorialCodeBlock };
