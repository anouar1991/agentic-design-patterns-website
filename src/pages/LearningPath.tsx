import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { layoutIds } from '../config/motion';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import {
  Map,
  ArrowRight,
  Rocket,
  Wrench,
  Database,
  Shield,
  Zap,
  BookOpen,
  Trophy,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { useState } from 'react';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';

interface Phase {
  phase: number;
  icon: React.ElementType;
  color: string;
  chapters: number[];
  skillKeys: string[];
}

const phases: Phase[] = [
  {
    phase: 1,
    icon: Rocket,
    color: '#10b981',
    chapters: [1, 2, 3, 4],
    skillKeys: [
      'sequentialTaskDecomposition',
      'intentClassificationRouting',
      'concurrentLLMOperations',
      'selfEvaluationLoops'
    ]
  },
  {
    phase: 2,
    icon: Wrench,
    color: '#3b82f6',
    chapters: [5, 6, 7],
    skillKeys: [
      'functionCallingToolIntegration',
      'multiStepPlanGeneration',
      'agentCoordinationPatterns',
      'emergentCollectiveBehavior'
    ]
  },
  {
    phase: 3,
    icon: Database,
    color: '#8b5cf6',
    chapters: [8, 9, 10, 11],
    skillKeys: [
      'shortLongTermMemory',
      'experienceBasedLearning',
      'mcpToolIntegration',
      'goalTrackingMetrics'
    ]
  },
  {
    phase: 4,
    icon: Shield,
    color: '#f59e0b',
    chapters: [12, 13, 14],
    skillKeys: [
      'errorRecoveryPatterns',
      'humanEscalationWorkflows',
      'ragImplementation',
      'fallbackStrategies'
    ]
  },
  {
    phase: 5,
    icon: Zap,
    color: '#ef4444',
    chapters: [15, 16, 17, 18, 19, 20, 21],
    skillKeys: [
      'a2aProtocolCommunication',
      'costLatencyOptimization',
      'chainOfThoughtReasoning',
      'inputOutputValidation',
      'agentPerformanceMetrics',
      'taskPrioritization',
      'autonomousExploration'
    ]
  }
];

export default function LearningPath() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const { completedChapters, completionPercentage, isChapterCompleted, getPhaseProgress } = useProgress();

  const totalChapters = phases.reduce((acc, p) => acc + p.chapters.length, 0);

  useDocumentMeta({
    title: 'Learning Path',
    description: 'Follow a structured 5-phase learning path through 21 agentic design patterns. Progress from foundations through advanced systems with guided chapters.',
    ogType: 'website',
    keywords: 'learning path, AI agents, structured learning, design patterns curriculum',
  });

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800/80 border border-dark-700 text-sm mb-6"
          >
            <Map className="w-4 h-4 text-primary-400" />
            <span className="text-dark-300">{t('learningPath.phasesCount')}</span>
            <span className="text-dark-600">•</span>
            <span className="text-dark-300">{t('learningPath.chaptersCount', { count: totalChapters })}</span>
            <span className="text-dark-600">•</span>
            <span className="text-emerald-400">{t('learningPath.completedCount', { count: completedChapters.length })}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-dark-50 mb-4"
          >
            {t('learningPath.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-dark-400 max-w-2xl mx-auto"
          >
            {t('learningPath.subtitle')}
          </motion.p>

          {/* Overall Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 max-w-md mx-auto"
          >
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-dark-400">{t('learningPath.overallProgress')}</span>
              <span className="text-dark-50 font-medium">{completionPercentage}%</span>
            </div>
            <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                layoutId={layoutIds.progressBar}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className={`absolute ${isRTL ? 'right-8' : 'left-8'} top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 via-violet-500 via-amber-500 to-red-500`} />

          <div className="space-y-8">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isExpanded = expandedPhase === phase.phase;

              return (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                  className={`relative ${isRTL ? 'pr-20' : 'pl-20'}`}
                >
                  {/* Phase marker */}
                  <div
                    className={`absolute ${isRTL ? 'right-0' : 'left-0'} w-16 h-16 rounded-2xl flex items-center justify-center z-10 transition-transform hover:scale-110 cursor-pointer`}
                    style={{ backgroundColor: phase.color }}
                    onClick={() => setExpandedPhase(isExpanded ? null : phase.phase)}
                  >
                    <Icon className="w-8 h-8 text-dark-50" />
                  </div>

                  {/* Content card */}
                  <div
                    className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'border-2' : ''
                    }`}
                    style={{ borderColor: isExpanded ? phase.color : 'transparent' }}
                  >
                    {/* Header */}
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => setExpandedPhase(isExpanded ? null : phase.phase)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
                            style={{
                              backgroundColor: `${phase.color}20`,
                              color: phase.color
                            }}
                          >
                            {t('learningPath.phase')} {phase.phase}
                          </span>
                          <h3 className="text-xl font-bold text-dark-50 mb-2">
                            {t(`phases.${phase.phase}.name`)}
                          </h3>
                          <p className="text-dark-400">{t(`phases.${phase.phase}.description`)}</p>
                        </div>
                        <div className={`text-${isRTL ? 'left' : 'right'} ${isRTL ? 'mr-4' : 'ml-4'}`}>
                          {(() => {
                            const progress = getPhaseProgress(phase.chapters);
                            return (
                              <>
                                <div className="text-2xl font-bold text-dark-50">
                                  {progress.completed}/{phase.chapters.length}
                                </div>
                                <div className="text-xs text-dark-400">{t('learningPath.completed')}</div>
                                {progress.percentage === 100 && (
                                  <CheckCircle2 className={`w-5 h-5 text-emerald-500 ${isRTL ? 'mr-auto' : 'ml-auto'} mt-1`} />
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Expanded content */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-dark-700 pt-6">
                        {/* Chapters */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-dark-300 mb-4 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            {t('learningPath.chaptersInPhase')}
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {phase.chapters.map((chapterNum) => {
                              const completed = isChapterCompleted(chapterNum);
                              return (
                                <Link
                                  key={chapterNum}
                                  to={`/chapter/${chapterNum}`}
                                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors group ${
                                    completed
                                      ? 'bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20'
                                      : 'bg-dark-800/50 hover:bg-dark-700/50'
                                  }`}
                                >
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                                      completed ? 'text-emerald-400' : 'text-dark-50'
                                    }`}
                                    style={{ backgroundColor: completed ? 'rgba(16, 185, 129, 0.2)' : phase.color }}
                                  >
                                    {completed ? <CheckCircle2 className="w-5 h-5" /> : chapterNum}
                                  </div>
                                  <span className={`transition-colors ${
                                    completed
                                      ? 'text-emerald-300 group-hover:text-emerald-200'
                                      : 'text-dark-200 group-hover:text-dark-50'
                                  }`}>
                                    {t(`chapterTitles.${chapterNum}`)}
                                  </span>
                                  {isRTL ? (
                                    <ArrowLeft className={`w-4 h-4 ${isRTL ? 'mr-auto' : 'ml-auto'} transition-colors ${
                                      completed
                                        ? 'text-emerald-500 group-hover:text-emerald-400'
                                        : 'text-dark-500 group-hover:text-dark-50'
                                    }`} />
                                  ) : (
                                    <ArrowRight className={`w-4 h-4 ml-auto transition-colors ${
                                      completed
                                        ? 'text-emerald-500 group-hover:text-emerald-400'
                                        : 'text-dark-500 group-hover:text-dark-50'
                                    }`} />
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        </div>

                        {/* Skills */}
                        <div>
                          <h4 className="text-sm font-semibold text-dark-300 mb-4 flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            {t('learningPath.skillsYoullLearn')}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {phase.skillKeys.map((skillKey, i) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 rounded-lg text-sm bg-dark-800/50 text-dark-300"
                              >
                                {t(`skills.${skillKey}`)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* End marker */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: phases.length * 0.15 }}
            className={`relative ${isRTL ? 'pr-20' : 'pl-20'} pt-8`}
          >
            <div className={`absolute ${isRTL ? 'right-0' : 'left-0'} w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500`}>
              <Trophy className="w-8 h-8 text-dark-50" />
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold text-dark-50 mb-2">
                {t('learningPath.congratulations')}
              </h3>
              <p className="text-dark-400 mb-4">
                {t('learningPath.congratulationsDesc')}
              </p>
              <Link
                to="/chapters"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                {t('learningPath.exploreAllChapters')}
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Quick Start CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: (phases.length + 1) * 0.15 }}
          className="mt-16 text-center"
        >
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-dark-50 mb-4">
              {t('learningPath.readyToBegin')}
            </h3>
            <p className="text-dark-400 mb-6">
              {t('learningPath.readyToBeginDesc')}
            </p>
            <Link
              to="/chapter/1"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:opacity-90 transition-opacity glow-success"
            >
              {t('learningPath.startWithChapter1')}
              {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
