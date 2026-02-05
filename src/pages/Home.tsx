import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { layoutIds } from '../config/motion';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Code,
  Users,
  Zap,
  Brain,
  Shield,
  Target,
  GitBranch,
  Layers,
  RefreshCw,
  Wrench,
  Map,
  HardDrive,
  TrendingUp,
  Plug,
  AlertTriangle,
  UserCheck,
  Search,
  MessageCircle,
  Cpu,
  Activity,
  ListOrdered,
  Compass,
  ChevronRight,
  CheckCircle2,
  Award
} from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { chapterDetails } from '../data/chapters';
import { Clock, BarChart2 } from 'lucide-react';
import HeroVisualization from '../components/HeroVisualization';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useAggregatedPresence } from '../hooks/usePresence';
import { prefetchRoute } from '../utils/prefetch';

const difficultyConfig = {
  beginner: { label: 'Beginner', color: '#22c55e' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced: { label: 'Advanced', color: '#ef4444' },
} as const;

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

const chapters = [
  { num: 1, title: 'Prompt Chaining', icon: 'link', color: '#f59e0b' },
  { num: 2, title: 'Routing', icon: 'git-branch', color: '#10b981' },
  { num: 3, title: 'Parallelization', icon: 'layers', color: '#3b82f6' },
  { num: 4, title: 'Reflection', icon: 'refresh-cw', color: '#ec4899' },
  { num: 5, title: 'Tool Use', icon: 'tool', color: '#f97316' },
  { num: 6, title: 'Planning', icon: 'map', color: '#14b8a6' },
  { num: 7, title: 'Multi-Agent', icon: 'users', color: '#8b5cf6' },
  { num: 8, title: 'Memory', icon: 'hard-drive', color: '#06b6d4' },
  { num: 9, title: 'Adaptation', icon: 'trending-up', color: '#84cc16' },
  { num: 10, title: 'MCP', icon: 'plug', color: '#a855f7' },
  { num: 11, title: 'Goals', icon: 'target', color: '#f43f5e' },
  { num: 12, title: 'Recovery', icon: 'alert-triangle', color: '#ef4444' },
  { num: 13, title: 'Human-Loop', icon: 'user-check', color: '#22c55e' },
  { num: 14, title: 'RAG', icon: 'search', color: '#3b82f6' },
  { num: 15, title: 'A2A Comm', icon: 'message-circle', color: '#6366f1' },
  { num: 16, title: 'Optimization', icon: 'cpu', color: '#ec4899' },
  { num: 17, title: 'Reasoning', icon: 'brain', color: '#f97316' },
  { num: 18, title: 'Guardrails', icon: 'shield-check', color: '#10b981' },
  { num: 19, title: 'Evaluation', icon: 'activity', color: '#06b6d4' },
  { num: 20, title: 'Prioritization', icon: 'list-ordered', color: '#a855f7' },
  { num: 21, title: 'Discovery', icon: 'compass', color: '#f43f5e' },
];

const getStats = (t: (key: string) => string) => [
  { label: t('home.statsChapters'), value: '21', icon: BookOpen },
  { label: t('home.statsCodeExamples'), value: '61+', icon: Code },
  { label: t('home.statsFrameworks'), value: '5+', icon: Layers },
  { label: t('home.statsPages'), value: '424', icon: BookOpen },
];

const getFeatures = (t: (key: string) => string) => [
  {
    icon: Zap,
    title: t('home.feature1Title'),
    description: t('home.feature1Desc'),
    color: '#f59e0b'
  },
  {
    icon: Code,
    title: t('home.feature2Title'),
    description: t('home.feature2Desc'),
    color: '#3b82f6'
  },
  {
    icon: Brain,
    title: t('home.feature3Title'),
    description: t('home.feature3Desc'),
    color: '#a855f7'
  },
  {
    icon: Shield,
    title: t('home.feature4Title'),
    description: t('home.feature4Desc'),
    color: '#10b981'
  },
];

export default function Home() {
  const { completedChapters, completionPercentage, isChapterCompleted } = useProgress();
  const { t } = useTranslation();
  const stats = getStats(t);
  const features = getFeatures(t);
  const chapterIds = chapters.map(c => c.num);
  const { getCount } = useAggregatedPresence(chapterIds);

  useDocumentMeta({
    title: 'Agentic Design Patterns - Interactive Learning',
    description: 'Interactive learning companion for Agentic Design Patterns by Antonio Gulli. Master 21 essential patterns for building intelligent AI systems with interactive diagrams, tutorials, and quizzes.',
    ogType: 'website',
    keywords: 'AI agents, LangChain, LangGraph, design patterns, LLM, artificial intelligence, machine learning, agentic patterns',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: 'Agentic Design Patterns',
      description: 'Master 21 essential patterns for building intelligent AI systems',
      provider: { '@type': 'Person', name: 'Antonio Gulli' },
      numberOfCredits: 21,
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: 'online',
        courseWorkload: 'PT10H',
      },
    },
  });

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated agentic pattern visualization behind hero content */}
        <HeroVisualization />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800/80 border border-dark-700 text-sm"
            >
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-dark-300">{t('footer.basedOn')}</span>
              <span className="text-dark-50 font-medium">Antonio Gulli</span>
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold">
              <span className="gradient-text">{t('home.heroTitle')}</span>
              <br />
              <span className="text-dark-50">{t('home.heroHighlight')}</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-dark-300 text-balance leading-relaxed">
              {t('home.heroSubtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/chapters"
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:shadow-lg hover:shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] glow-primary"
              >
                {t('home.startLearning')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl-rotate-180 transition-transform" />
              </Link>
              <Link
                to="/learning-path"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-dark-800/80 border border-dark-700/60 text-dark-50 font-medium hover:bg-dark-700/80 hover:border-dark-600 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Map className="w-5 h-5" />
                {t('home.exploreChapters')}
              </Link>
            </div>

            {/* Beginner Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-2"
            >
              <Link
                to="/introduction"
                className="text-dark-400 hover:text-primary-400 transition-colors text-sm"
              >
                {t('home.newToAgents')} <span className="underline">{t('home.startBasics')}</span> →
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12"
            >
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="glass rounded-xl p-4 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Icon className="w-5 h-5 text-primary-400" />
                      <span className="text-3xl font-bold text-dark-50">{stat.value}</span>
                    </div>
                    <span className="text-sm text-dark-400">{stat.label}</span>
                  </div>
                );
              })}
            </motion.div>

            {/* Progress Widget */}
            {completedChapters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <div className="glass rounded-xl p-6 max-w-md mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-dark-50 font-medium">{t('home.yourProgress')}</div>
                      <div className="text-sm text-dark-400">
                        {t('home.chaptersCompleted', { count: completedChapters.length })}
                      </div>
                    </div>
                  </div>
                  <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                    <motion.div
                      layoutId={layoutIds.progressBar}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: completionPercentage / 100 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-dark-400">{t('home.progress')}</span>
                    <span className="text-emerald-400 font-medium">{completionPercentage}%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1, duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-dark-600 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-dark-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-50 mb-4">
              {t('home.learnInteractive')}{' '}
              <span className="gradient-text">{t('home.interactiveWay')}</span>
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              {t('home.learnInteractiveDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="glass rounded-2xl p-6 hover:border-dark-600/70 group shimmer-hover"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-dark-50 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-dark-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chapters Overview */}
      <section className="py-20 border-t border-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark-50 mb-4">
              {t('home.essentialPatterns')}
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              {t('home.essentialPatternsDesc')}
            </p>
          </div>

          <motion.div
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.04,
                  delayChildren: 0.6,
                },
              },
            }}
          >
            {chapters.map((chapter) => {
              const Icon = iconMap[chapter.icon] || Zap;
              const completed = isChapterCompleted(chapter.num);
              const detail = chapterDetails[chapter.num];
              const readingMeta = detail?.readingMeta;
              const difficulty = readingMeta?.difficulty;
              const diffInfo = difficulty ? difficultyConfig[difficulty] : null;
              const viewerCount = getCount(chapter.num);

              return (
                <motion.div
                  key={chapter.num}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
                  }}
                >
                  <Link
                    to={`/chapter/${chapter.num}`}
                    onMouseEnter={() => prefetchRoute('chapter')}
                    className={`chapter-card group block glass rounded-xl p-4 text-center relative ${
                      completed
                        ? 'border-emerald-500/30 chapter-card-completed'
                        : ''
                    }`}
                    style={{ '--card-glow': `${chapter.color}40` } as React.CSSProperties}
                  >
                    {/* Completion badge */}
                    {completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 z-10"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </motion.div>
                    )}

                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                        completed ? 'ring-2 ring-emerald-500/30' : ''
                      }`}
                      style={{ backgroundColor: `${chapter.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: chapter.color }} />
                    </div>

                    {/* Chapter number */}
                    <div className={`text-xs font-medium mb-1 ${
                      completed ? 'text-emerald-400' : 'text-dark-400'
                    }`}>
                      Ch {chapter.num}
                    </div>

                    {/* Title */}
                    <div className="text-sm font-medium text-dark-50 truncate">
                      {chapter.title}
                    </div>

                    {/* Metadata: reading time + difficulty + active viewers */}
                    <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-dark-500">
                      {readingMeta && (
                        <>
                          <span className="inline-flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {readingMeta.estimatedMinutes}m
                          </span>
                          {diffInfo && (
                            <span
                              className="inline-flex items-center gap-0.5"
                              style={{ color: diffInfo.color }}
                            >
                              <BarChart2 className="w-2.5 h-2.5" />
                              {diffInfo.label.charAt(0)}
                            </span>
                          )}
                        </>
                      )}
                      {viewerCount > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-primary-400">
                          <Users className="w-2.5 h-2.5" />
                          {viewerCount}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="text-center mt-12">
            <Link
              to="/chapters"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
            >
              {t('home.viewAllChapters')}
              <ChevronRight className="w-4 h-4 rtl-rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* Learning Path Preview */}
      <section className="py-20 border-t border-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-dark-50 mb-4">
                {t('home.structuredPath')}
              </h2>
              <p className="text-dark-400 mb-8">
                {t('home.structuredPathDesc')}
              </p>

              <div className="space-y-4">
                {[
                  { phase: 1, name: 'Foundations', chapters: '1-4', color: '#10b981' },
                  { phase: 2, name: 'Tool Mastery', chapters: '5-7', color: '#3b82f6' },
                  { phase: 3, name: 'Infrastructure', chapters: '8-11', color: '#8b5cf6' },
                  { phase: 4, name: 'Robustness', chapters: '12-14', color: '#f59e0b' },
                  { phase: 5, name: 'Advanced Systems', chapters: '15-21', color: '#ef4444' },
                ].map((phase, index) => (
                  <motion.div
                    key={phase.phase}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: phase.color }}
                    >
                      {phase.phase}
                    </div>
                    <div>
                      <div className="font-semibold text-dark-50">{phase.name}</div>
                      <div className="text-sm text-dark-400">
                        Chapters {phase.chapters}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/learning-path"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-dark-800 border border-dark-700 text-dark-50 font-medium hover:bg-dark-700 transition-colors"
              >
                <Map className="w-5 h-5" />
                {t('home.explorePath')}
              </Link>
            </div>

            <div className="relative">
              <div className="glass rounded-2xl p-8 border border-dark-700">
                <div className="grid grid-cols-5 gap-2">
                  {chapters.slice(0, 20).map((chapter) => {
                    // WCAG AA accessible colors: all pass 4.5:1 contrast with white text
                    let phaseColor = '#047857'; // emerald-700 (5.36:1)
                    if (chapter.num > 4 && chapter.num <= 7) phaseColor = '#2563eb'; // blue-600 (5.17:1)
                    if (chapter.num > 7 && chapter.num <= 11) phaseColor = '#7c3aed'; // violet-600 (5.70:1)
                    if (chapter.num > 11 && chapter.num <= 14) phaseColor = '#b45309'; // amber-700 (5.02:1)
                    if (chapter.num > 14) phaseColor = '#dc2626'; // red-600 (4.83:1)

                    return (
                      <motion.div
                        key={chapter.num}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 1.4 + (chapter.num - 1) * 0.03 }}
                        className="aspect-square rounded-lg flex items-center justify-center text-sm font-bold text-white"
                        style={{ backgroundColor: phaseColor }}
                      >
                        {chapter.num}
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-4 text-center">
                  <div className="text-xs text-dark-400">
                    {t('home.visualTracker')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-dark-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 2.0 }}
          >
            <h2 className="text-3xl font-bold text-dark-50 mb-4">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-dark-400 mb-8 max-w-2xl mx-auto">
              {t('home.ctaSubtitle')}
            </p>
            <Link
              to="/chapter/1"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:shadow-lg hover:shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] glow-primary"
            >
              {t('home.ctaButton')}
              <ArrowRight className="w-5 h-5 rtl-rotate-180" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
