import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import EnhancedCodeBlock from '../components/EnhancedCodeBlock';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Code,
  FileCode,
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
  CheckCircle,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { chapterDetails } from '../data/chapters';
import { useCallback, useState, useRef, useEffect } from 'react';
import { useProgress } from '../contexts/ProgressContext';
import { DiagramProvider, useDiagram } from '../contexts/DiagramContext';
import { useLanguage } from '../contexts/LanguageContext';
import LearningObjectives from '../components/LearningObjectives';
import ChapterQuiz from '../components/ChapterQuiz';
import { InteractiveDiagram } from '../components/diagram';
import { InteractiveTutorial } from '../components/tutorial';
import ReadingProgressBar from '../components/ReadingProgressBar';
import ChapterCelebration from '../components/ChapterCelebration';

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

// Section progress indicator component
function SectionIndicator({ number, title, isActive }: { number: number; title: string; isActive?: boolean }) {
  return (
    <div className={`flex items-center gap-3 mb-2 ${isActive ? 'text-white' : 'text-dark-400'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
        isActive ? 'bg-primary-500 text-white' : 'bg-dark-700'
      }`}>
        {number}
      </div>
      <span className="text-sm font-medium uppercase tracking-wide">{title}</span>
    </div>
  );
}

// Inner component that uses DiagramContext
function ChapterContent() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const chapterNum = parseInt(id || '1', 10);
  const { isChapterCompleted, markChapterComplete, toggleChapterComplete } = useProgress();
  const { setScrollToCodeCallback, highlightedCodeLines } = useDiagram();

  const chapter = chapterDetails[chapterNum];
  const isCompleted = isChapterCompleted(chapterNum);
  const [showCelebration, setShowCelebration] = useState(false);

  // Refs for code examples to enable scrolling
  const codeExampleRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Set up the scroll-to-code callback for the diagram
  useEffect(() => {
    setScrollToCodeCallback((index: number) => {
      const ref = codeExampleRefs.current[index];
      if (ref) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add highlight flash
        ref.classList.add('animate-highlight');
        setTimeout(() => ref.classList.remove('animate-highlight'), 1000);
      }
    });
  }, [setScrollToCodeCallback]);

  const handleQuizPass = useCallback(() => {
    markChapterComplete(chapterNum);
    setShowCelebration(true);
  }, [markChapterComplete, chapterNum]);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
  }, []);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{t('chapter.chapterNotFound')}</h1>
          <Link to="/chapters" className="text-primary-400 hover:text-primary-300">
            {t('chapter.backToChapters')}
          </Link>
        </div>
      </div>
    );
  }

  const Icon = iconMap[chapter.icon] || Zap;

  return (
    <div className="min-h-screen">
      {/* Reading Progress Bar */}
      <ReadingProgressBar
        chapterColor={chapter.color}
        estimatedMinutes={chapter.readingMeta?.estimatedMinutes}
      />

      {/* Hero Section - Streamlined */}
      <section className="relative py-12 overflow-hidden border-b border-dark-800">
        <div className="absolute inset-0 pattern-dots" />
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: chapter.color }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm mb-6"
            aria-label="Breadcrumb"
          >
            <Link
              to="/"
              className="text-dark-500 hover:text-dark-300 transition-colors"
            >
              {t('nav.home')}
            </Link>
            <span className="text-dark-600">/</span>
            <Link
              to="/chapters"
              className="text-dark-400 hover:text-dark-200 transition-colors"
            >
              {t('nav.chapters')}
            </Link>
            <span className="text-dark-600">/</span>
            <span
              className="font-medium"
              style={{ color: chapter.color }}
            >
              {t('chaptersPage.ch')} {chapter.number}
            </span>
          </motion.nav>

          {/* Title and Meta */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${chapter.color}20` }}
              >
                <Icon className="w-7 h-7" style={{ color: chapter.color }} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${chapter.color}15`,
                      color: chapter.color
                    }}
                  >
                    {t('chaptersPage.ch')} {chapter.number}
                  </span>
                  {chapter.readingMeta && (
                    <span className="flex items-center gap-1 text-xs text-dark-400">
                      <Clock className="w-3 h-3" />
                      {chapter.readingMeta.estimatedMinutes} {t('chapter.min')}
                    </span>
                  )}
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      {t('chapter.done')}
                    </span>
                  )}
                </div>
                <p className="text-sm text-dark-400">{chapter.partName}</p>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">
              {chapter.title}
            </h1>

            <p className="text-lg text-dark-300 mb-6">
              {chapter.description}
            </p>
          </motion.div>

          {/* Narrative Introduction - Lead with the story */}
          {chapter.narrativeIntro && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl glass rounded-xl p-6 border-l-4"
              style={{ borderLeftColor: chapter.color }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4" style={{ color: chapter.color }} />
                <span className="text-sm font-medium text-dark-400">{t('chapter.theBigPicture')}</span>
              </div>
              <div className="text-dark-200 space-y-3 leading-relaxed">
                {chapter.narrativeIntro.split('\n\n').map((paragraph, i) => (
                  <p key={i} dangerouslySetInnerHTML={{
                    __html: paragraph
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                  }} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Main Content with Sticky Diagram */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Left Column - Scrollable Content */}
            <div className="lg:col-span-7 space-y-12">
              {/* Section 1: Key Concepts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <SectionIndicator number={1} title={t('chapter.sections.keyConcepts')} isActive />
                <div className="glass rounded-xl p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                    <BookOpen className="w-5 h-5 text-primary-400" />
                    {t('chapter.whatYoullLearn')}
                  </h3>
                  <p className="text-sm text-dark-400 mb-4">{chapter.keyConceptsIntro}</p>
                  <ul className="space-y-3">
                    {chapter.keyConcepts.map((concept, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                          style={{ color: chapter.color }}
                        />
                        <span className="text-dark-200">{concept}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Section 2: Interactive Tutorial or Code Examples */}
              {chapter.tutorial && chapter.tutorial.length > 0 ? (
                <>
                  <div>
                    <SectionIndicator number={2} title={t('chapter.sections.tutorial')} />
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="mb-6"
                    >
                      <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                        <Code className="w-6 h-6" style={{ color: chapter.color }} />
                        {t('chapter.handsonTutorial')}
                      </h2>
                      <p className="text-dark-400">
                        {t('chapter.tutorialHint')}
                      </p>
                    </motion.div>
                    <InteractiveTutorial
                      sections={chapter.tutorial}
                      chapterColor={chapter.color}
                    />
                  </div>

                  {/* Pattern Code Examples - For diagram node linking */}
                  {chapter.codeExamples.length > 0 && (
                    <div className="mt-12">
                      <SectionIndicator number={3} title={t('chapter.sections.completeCode')} />
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                        className="mb-6"
                      >
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                          <FileCode className="w-6 h-6" style={{ color: chapter.color }} />
                          {t('chapter.codeExamplesTitle')}
                        </h2>
                        <p className="text-dark-400">
                          {t('chapter.codeExamplesHint')}
                        </p>
                      </motion.div>

                      <div className="space-y-6">
                        {chapter.codeExamples.map((example, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                          >
                            <EnhancedCodeBlock
                              code={example.code}
                              language={example.language}
                              title={example.title}
                              chapterColor={chapter.color}
                              highlightedLines={highlightedCodeLines}
                              explanation={example.explanation}
                              refCallback={(el) => { codeExampleRefs.current[index] = el; }}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : chapter.codeExamples.length > 0 && (
                <div>
                  <SectionIndicator number={2} title={t('chapter.sections.implementation')} />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="mb-6"
                  >
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                      <Code className="w-6 h-6" style={{ color: chapter.color }} />
                      {t('chapter.codeExamplesTitle')}
                    </h2>
                    <p className="text-dark-400">
                      {t('chapter.codeExamplesDesc')}
                    </p>
                  </motion.div>

                  <div className="space-y-6">
                    {chapter.codeExamples.map((example, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      >
                        <EnhancedCodeBlock
                          code={example.code}
                          language={example.language}
                          title={example.title}
                          chapterColor={chapter.color}
                          highlightedLines={highlightedCodeLines}
                          explanation={example.explanation}
                          refCallback={(el) => { codeExampleRefs.current[index] = el; }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sticky Diagram */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="sticky top-24">
                {chapter.diagramNodes && chapter.diagramNodes.length > 0 ? (
                  <InteractiveDiagram
                    diagramNodes={chapter.diagramNodes}
                    diagramEdges={chapter.diagramEdges || []}
                    chapterColor={chapter.color}
                    title={t('chapter.patternFlow')}
                  />
                ) : (
                  <div className="glass rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-dark-700">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-primary-400" />
                        {t('chapter.patternFlow')}
                      </h3>
                    </div>
                    <div className="h-[400px] flex items-center justify-center text-dark-400">
                      <div className="text-center">
                        <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{t('chapter.diagramComingSoon')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Diagram - Shows below content on mobile */}
          <div className="lg:hidden mt-8">
            {chapter.diagramNodes && chapter.diagramNodes.length > 0 && (
              <InteractiveDiagram
                diagramNodes={chapter.diagramNodes}
                diagramEdges={chapter.diagramEdges || []}
                chapterColor={chapter.color}
                title={t('chapter.patternFlow')}
              />
            )}
          </div>
        </div>
      </section>

      {/* Quiz Section with Learning Objectives */}
      {chapter.quiz && (
        <section className="py-16 border-t border-dark-800 bg-dark-900/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionIndicator
              number={chapter.tutorial && chapter.codeExamples.length > 0 ? 4 : 3}
              title={t('chapter.sections.validateLearning')}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
                <Target className="w-6 h-6" style={{ color: chapter.color }} />
                {t('chapter.testYourKnowledge')}
              </h2>
              <p className="text-dark-400">
                {t('chapter.quizDescription')}
              </p>
            </motion.div>

            {/* Learning Objectives - Moved here as checklist before quiz */}
            {chapter.learningObjectives && chapter.learningObjectives.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="mb-8"
              >
                <LearningObjectives
                  objectives={chapter.learningObjectives}
                  chapterColor={chapter.color}
                />
              </motion.div>
            )}

            <ChapterQuiz
              quiz={chapter.quiz}
              chapterColor={chapter.color}
              chapterId={Number(id)}
              onPass={handleQuizPass}
            />

            {/* Mark Complete Button - After Quiz */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="mt-8 text-center"
            >
              <button
                onClick={() => toggleChapterComplete(chapterNum)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 ring-1 ring-emerald-500/30'
                    : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    {t('chapter.chapterCompleted')}
                  </>
                ) : (
                  <>
                    <Circle className="w-5 h-5" />
                    {t('chapter.markAsComplete')}
                  </>
                )}
              </button>
              {!isCompleted && (
                <p className="text-xs text-dark-500 mt-2">
                  {t('chapter.quizHint')}
                </p>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Navigation - Improved alignment */}
      <section className="py-12 border-t border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Previous Chapter */}
            <div className={`${isRTL ? 'justify-self-end' : 'justify-self-start'}`}>
              {chapter.prevChapter && (
                <Link
                  to={`/chapter/${chapter.prevChapter}`}
                  className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-dark-800 border border-dark-700 hover:bg-dark-700 transition-colors"
                >
                  {isRTL ? (
                    <ArrowRight className="w-5 h-5 text-dark-400 group-hover:text-white transition-colors" />
                  ) : (
                    <ArrowLeft className="w-5 h-5 text-dark-400 group-hover:text-white transition-colors" />
                  )}
                  <div>
                    <div className="text-xs text-dark-400">{t('chapter.previous')}</div>
                    <div className="text-white font-medium">
                      {t('chaptersPage.ch')} {chapter.prevChapter}
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* All Chapters - Center */}
            <div className="justify-self-center">
              <Link
                to="/chapters"
                className="px-5 py-3 rounded-xl bg-dark-800 border border-dark-700 hover:bg-dark-700 transition-colors text-dark-300 hover:text-white inline-flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                {t('chapter.allChapters')}
              </Link>
            </div>

            {/* Next Chapter */}
            <div className={`${isRTL ? 'justify-self-start' : 'justify-self-end'}`}>
              {chapter.nextChapter && (
                <Link
                  to={`/chapter/${chapter.nextChapter}`}
                  className="group flex items-center gap-3 px-5 py-3 rounded-xl border transition-colors"
                  style={{
                    backgroundColor: `${chapter.color}15`,
                    borderColor: `${chapter.color}30`
                  }}
                >
                  <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                    <div className="text-xs text-dark-400">{t('chapter.next')}</div>
                    <div className="text-white font-medium">
                      {t('chaptersPage.ch')} {chapter.nextChapter}
                    </div>
                  </div>
                  {isRTL ? (
                    <ArrowLeft className="w-5 h-5 transition-colors" style={{ color: chapter.color }} />
                  ) : (
                    <ArrowRight className="w-5 h-5 transition-colors" style={{ color: chapter.color }} />
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Celebration Modal */}
      <ChapterCelebration
        isVisible={showCelebration}
        chapterTitle={chapter.title}
        chapterColor={chapter.color}
        onComplete={handleCelebrationComplete}
      />
    </div>
  );
}

// Main component that provides the DiagramContext
export default function Chapter() {
  return (
    <DiagramProvider>
      <ChapterContent />
    </DiagramProvider>
  );
}
