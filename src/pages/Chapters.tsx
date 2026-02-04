import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProgress } from '../contexts/ProgressContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { prefetchRoute } from '../utils/prefetch';

import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GitBranch,
  Layers,
  RefreshCw,
  Wrench,
  Map,
  Users,
  HardDrive,
  TrendingUp,
  Plug,
  Target,
  AlertTriangle,
  UserCheck,
  Search,
  MessageCircle,
  Cpu,
  Brain,
  Shield,
  Activity,
  ListOrdered,
  Compass,
  Zap,
  FileCode,
  Trophy
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  link: GitBranch,
  'git-branch': GitBranch,
  layers: Layers,
  'refresh-cw': RefreshCw,
  tool: Wrench,
  map: Map,
  users: Users,
  'hard-drive': HardDrive,
  'trending-up': TrendingUp,
  plug: Plug,
  target: Target,
  'alert-triangle': AlertTriangle,
  'user-check': UserCheck,
  search: Search,
  'message-circle': MessageCircle,
  cpu: Cpu,
  brain: Brain,
  'shield-check': Shield,
  activity: Activity,
  'list-ordered': ListOrdered,
  compass: Compass
};

interface Chapter {
  num: number;
  icon: string;
  color: string;
  notebooks: number;
}

interface Part {
  id: string;
  color: string;
  chapters: Chapter[];
}

const parts: Part[] = [
  {
    id: 'core',
    color: '#8b5cf6',
    chapters: [
      { num: 1, icon: 'link', color: '#f59e0b', notebooks: 2 },
      { num: 2, icon: 'git-branch', color: '#10b981', notebooks: 3 },
      { num: 3, icon: 'layers', color: '#3b82f6', notebooks: 2 },
      { num: 4, icon: 'refresh-cw', color: '#ec4899', notebooks: 3 },
      { num: 5, icon: 'tool', color: '#f97316', notebooks: 5 },
      { num: 6, icon: 'map', color: '#14b8a6', notebooks: 2 },
      { num: 7, icon: 'users', color: '#8b5cf6', notebooks: 6 },
    ]
  },
  {
    id: 'infra',
    color: '#14b8a6',
    chapters: [
      { num: 8, icon: 'hard-drive', color: '#06b6d4', notebooks: 5 },
      { num: 9, icon: 'trending-up', color: '#84cc16', notebooks: 1 },
      { num: 10, icon: 'plug', color: '#a855f7', notebooks: 5 },
      { num: 11, icon: 'target', color: '#f43f5e', notebooks: 1 },
    ]
  },
  {
    id: 'recovery',
    color: '#f59e0b',
    chapters: [
      { num: 12, icon: 'alert-triangle', color: '#ef4444', notebooks: 1 },
      { num: 13, icon: 'user-check', color: '#22c55e', notebooks: 1 },
      { num: 14, icon: 'search', color: '#3b82f6', notebooks: 3 },
    ]
  },
  {
    id: 'advanced',
    color: '#ef4444',
    chapters: [
      { num: 15, icon: 'message-circle', color: '#6366f1', notebooks: 3 },
      { num: 16, icon: 'cpu', color: '#ec4899', notebooks: 2 },
      { num: 17, icon: 'brain', color: '#f97316', notebooks: 4 },
      { num: 18, icon: 'shield-check', color: '#10b981', notebooks: 4 },
      { num: 19, icon: 'activity', color: '#06b6d4', notebooks: 2 },
      { num: 20, icon: 'list-ordered', color: '#a855f7', notebooks: 1 },
      { num: 21, icon: 'compass', color: '#f43f5e', notebooks: 1 },
    ]
  }
];

export default function Chapters() {
  const { t } = useTranslation();
  const { isChapterCompleted, getPhaseProgress, getQuizScore } = useProgress();

  useDocumentMeta({
    title: 'All Chapters',
    description: 'Browse all 21 agentic design pattern chapters. From prompt chaining to agent discovery, master the essential patterns for building intelligent AI systems.',
    ogType: 'website',
    keywords: 'AI design patterns, chapters, prompt chaining, routing, parallelization, reflection, tool use, planning, multi-agent',
  });

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800/80 border border-dark-700 text-sm mb-6"
          >
            <BookOpen className="w-4 h-4 text-primary-400" />
            <span className="text-dark-300">{t('chaptersPage.chaptersCount')}</span>
            <span className="text-dark-600">•</span>
            <span className="text-dark-300">{t('chaptersPage.codeExamplesCount')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-dark-50 mb-4"
          >
            {t('chaptersPage.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-dark-400 max-w-2xl mx-auto"
          >
            {t('chaptersPage.subtitle')}
          </motion.p>
        </div>

        {/* Parts and Chapters */}
        <div className="space-y-16">
          {parts.map((part, partIndex) => (
            <motion.section
              key={part.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: partIndex * 0.15 }}
            >
              {/* Part Header */}
              {(() => {
                const phaseChapterIds = part.chapters.map(c => c.num);
                const phaseProgress = getPhaseProgress(phaseChapterIds);
                return (
                  <div className="flex items-center gap-4 mb-8">
                    <div
                      className="w-1.5 h-16 rounded-full"
                      style={{ backgroundColor: part.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-dark-50">{t(`parts.${part.id}.name`)}</h2>
                        {phaseProgress.completed > 0 && (
                          <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                            {phaseProgress.completed}/{phaseProgress.total} completed
                          </span>
                        )}
                      </div>
                      <p className="text-dark-400">{t(`parts.${part.id}.description`)}</p>
                      {phaseProgress.completed > 0 && (
                        <div className="mt-2 h-1 rounded-full bg-dark-700 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: phaseProgress.percentage / 100 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Chapter Cards Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {part.chapters.map((chapter) => {
                  const Icon = iconMap[chapter.icon] || Zap;
                  const completed = isChapterCompleted(chapter.num);
                  const quizScore = getQuizScore(chapter.num);
                  // Use global chapter number for sequential animation across all parts
                  const globalDelay = (chapter.num - 1) * 0.04;
                  return (
                    <motion.div
                      key={chapter.num}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: globalDelay }}
                    >
                      <Link
                        to={`/chapter/${chapter.num}`}
                        onMouseEnter={() => prefetchRoute('chapter')}
                        className={`chapter-card group block glass rounded-2xl p-6 h-full hover:border-dark-600/70 shimmer-hover relative ${
                          completed ? 'border-emerald-500/30 chapter-card-completed' : ''
                        }`}
                      >
                        {/* Completion badge */}
                        {completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 z-10"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-dark-50" />
                          </motion.div>
                        )}

                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                              completed ? 'ring-2 ring-emerald-500/30' : ''
                            }`}
                            style={{ backgroundColor: `${chapter.color}20` }}
                          >
                            <Icon className="w-6 h-6" style={{ color: chapter.color }} />
                          </div>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${chapter.color}15`,
                              color: chapter.color
                            }}
                          >
                            {t('chaptersPage.ch')} {chapter.num}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-dark-50 mb-2 group-hover:text-primary-400 transition-colors">
                          {t(`chapterTitles.${chapter.num}`)}
                        </h3>

                        <p className="text-sm text-dark-400 mb-4">
                          {t(`chapterDescriptions.${chapter.num}`)}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-dark-500">
                            <span className="inline-flex items-center gap-1">
                              <FileCode className="w-4 h-4" />
                              {chapter.notebooks} {t('chaptersPage.examples')}
                            </span>
                            {quizScore && (
                              <span className={`inline-flex items-center gap-1 ${
                                quizScore.passed ? 'text-emerald-400' : 'text-amber-400'
                              }`}>
                                <Trophy className="w-3.5 h-3.5" />
                                {quizScore.score}/{quizScore.totalQuestions}
                              </span>
                            )}
                          </div>
                          <ChevronRight
                            className="w-5 h-5 text-dark-600 group-hover:text-primary-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl-rotate-180 transition-all"
                          />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}
