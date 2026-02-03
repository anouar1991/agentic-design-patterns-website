import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  Clock,
  Trophy,
  GripVertical,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { ChapterQuiz as ChapterQuizType, QuizQuestion, QuizQuestionType } from '../data/types';
import { useQuizAttempts, formatQuizScore } from '../hooks/useQuizAttempts';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';

interface ChapterQuizProps {
  quiz: ChapterQuizType;
  chapterColor: string;
  chapterId: number;
  onPass?: () => void;
}

type QuizState = 'intro' | 'question' | 'feedback' | 'results';

interface Answer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

// Session storage key for mid-quiz persistence
const QUIZ_SESSION_KEY = (chapterId: number) => `quiz-session-${chapterId}`;

interface QuizSessionState {
  currentQuestionIndex: number;
  answers: Answer[];
  startTime: number;
}

// Helper: get resolved question type (backward compatible)
function getQuestionType(q: QuizQuestion): QuizQuestionType {
  return q.type || 'multiple-choice';
}

// Helper: check if ordering answer is correct
function isOrderingCorrect(order: string[], correctOrder: string[]): boolean {
  if (order.length !== correctOrder.length) return false;
  return order.every((id, i) => id === correctOrder[i]);
}

// ─── Confetti particle component ────────────────────────────────────────
function ConfettiParticles({ color }: { color: string }) {
  const particles = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 300,
      y: -(Math.random() * 200 + 50),
      rotate: Math.random() * 720 - 360,
      scale: Math.random() * 0.5 + 0.5,
      delay: Math.random() * 0.3,
      hue: Math.random() * 60 - 30, // offset from base color
    })),
  []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 w-2 h-2 rounded-sm"
          style={{ backgroundColor: color, opacity: 0.9 }}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: [0, p.scale, 0],
            rotate: p.rotate,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.2,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Shake animation wrapper ────────────────────────────────────────────
function ShakeWrapper({ shake, children }: { shake: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

// ─── Ordering question renderer ─────────────────────────────────────────
function OrderingQuestion({
  question,
  orderedItems,
  onReorder,
  chapterColor,
}: {
  question: QuizQuestion;
  orderedItems: string[];
  onReorder: (newOrder: string[]) => void;
  chapterColor: string;
}) {
  const optionMap = useMemo(
    () => new Map(question.options.map(o => [o.id, o.text])),
    [question.options],
  );

  // Keyboard handler: Arrow Up/Down to move focused item
  const handleItemKeyDown = useCallback((e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowUp' && idx > 0) {
      e.preventDefault();
      const newOrder = [...orderedItems];
      [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
      onReorder(newOrder);
      // Focus the moved item at its new position
      setTimeout(() => {
        const items = (e.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>('[data-reorder-item]');
        items?.[idx - 1]?.focus();
      }, 50);
    } else if (e.key === 'ArrowDown' && idx < orderedItems.length - 1) {
      e.preventDefault();
      const newOrder = [...orderedItems];
      [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
      onReorder(newOrder);
      setTimeout(() => {
        const items = (e.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>('[data-reorder-item]');
        items?.[idx + 1]?.focus();
      }, 50);
    }
  }, [orderedItems, onReorder]);

  return (
    <div>
      <p className="text-sm text-dark-400 mb-3 flex items-center gap-2">
        <GripVertical className="w-4 h-4" />
        Drag to reorder or use arrow keys
      </p>
      <Reorder.Group
        axis="y"
        values={orderedItems}
        onReorder={onReorder}
        className="space-y-2"
        role="listbox"
        aria-label="Reorder items"
      >
        {orderedItems.map((itemId, idx) => (
          <Reorder.Item
            key={itemId}
            value={itemId}
            data-reorder-item
            tabIndex={0}
            role="option"
            aria-label={`Position ${idx + 1}: ${optionMap.get(itemId)}. Use arrow keys to reorder.`}
            onKeyDown={(e: React.KeyboardEvent) => handleItemKeyDown(e, idx)}
            className="flex items-center gap-3 p-4 rounded-xl border-2 border-dark-600 bg-dark-800/50 cursor-grab active:cursor-grabbing select-none"
            whileDrag={{
              scale: 1.02,
              boxShadow: `0 0 20px ${chapterColor}40`,
              borderColor: chapterColor,
            }}
          >
            <span
              className="flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold text-dark-50 shrink-0"
              style={{ backgroundColor: `${chapterColor}60` }}
            >
              {idx + 1}
            </span>
            <GripVertical className="w-4 h-4 text-dark-500 shrink-0" />
            <span className="text-dark-200">{optionMap.get(itemId)}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}

// ─── Multiple choice / True-false renderer ──────────────────────────────
function ChoiceQuestion({
  question,
  selectedOption,
  onSelect,
}: {
  question: QuizQuestion;
  selectedOption: string | null;
  onSelect: (id: string) => void;
}) {
  const qType = getQuestionType(question);
  const isTrueFalse = qType === 'true-false';

  return (
    <div className={`space-y-3 ${isTrueFalse ? 'flex gap-4 space-y-0' : ''}`}>
      {question.options.map(option => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`${isTrueFalse ? 'flex-1' : 'w-full'} text-left p-4 rounded-xl border-2 transition-all ${
            selectedOption === option.id
              ? 'border-primary-500 bg-primary-500/10 scale-[1.01]'
              : 'border-dark-600 hover:border-dark-500 bg-dark-800/50'
          }`}
        >
          <span className="text-dark-200">
            {isTrueFalse && (
              <span className="mr-2 text-lg">
                {option.text.toLowerCase() === 'true' ? '✓' : '✗'}
              </span>
            )}
            {option.text}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Code snippet display ───────────────────────────────────────────────
function QuestionCodeSnippet({ code }: { code: string }) {
  return (
    <pre className="mb-4 p-4 rounded-xl bg-dark-900 border border-dark-700 overflow-x-auto text-sm">
      <code className="text-dark-200 font-mono">{code}</code>
    </pre>
  );
}

// ─── Question type badge ────────────────────────────────────────────────
function QuestionTypeBadge({ type }: { type: QuizQuestionType }) {
  const labels: Record<QuizQuestionType, { text: string; icon: React.ReactNode }> = {
    'multiple-choice': { text: 'Multiple Choice', icon: <HelpCircle className="w-3 h-3" /> },
    'true-false': { text: 'True / False', icon: <Zap className="w-3 h-3" /> },
    'ordering': { text: 'Put in Order', icon: <GripVertical className="w-3 h-3" /> },
  };
  const label = labels[type];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-dark-400 bg-dark-800 border border-dark-700 mb-4">
      {label.icon}
      {label.text}
    </span>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// Main ChapterQuiz component
// ═════════════════════════════════════════════════════════════════════════
export default function ChapterQuiz({ quiz, chapterColor, chapterId, onPass }: ChapterQuizProps) {
  // Restore session state if mid-quiz
  const savedSession = useMemo(() => {
    try {
      const raw = sessionStorage.getItem(QUIZ_SESSION_KEY(chapterId));
      if (raw) return JSON.parse(raw) as QuizSessionState;
    } catch { /* ignore */ }
    return null;
  }, [chapterId]);

  const [state, setState] = useState<QuizState>(savedSession ? 'question' : 'intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(savedSession?.currentQuestionIndex ?? 0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>(savedSession?.answers ?? []);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasSavedAttempt, setHasSavedAttempt] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shakeWrong, setShakeWrong] = useState(false);

  // Ordering question state
  const [orderedItems, setOrderedItems] = useState<string[]>([]);

  // Track quiz duration
  const startTimeRef = useRef<number>(savedSession?.startTime ?? 0);

  // Auth and quiz persistence
  const { user } = useAuth();
  const { bestScore, attemptCount, saveAttempt, saving } = useQuizAttempts(chapterId);
  const { saveQuizScore } = useProgress();

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const currentQType = currentQuestion ? getQuestionType(currentQuestion) : 'multiple-choice';

  // Initialize ordering items when question changes
  useEffect(() => {
    if (currentQuestion && getQuestionType(currentQuestion) === 'ordering') {
      // Shuffle the options for ordering questions
      const ids = currentQuestion.options.map(o => o.id);
      setOrderedItems(shuffleArray(ids));
    }
  }, [currentQuestion]);

  // Persist mid-quiz state to sessionStorage
  useEffect(() => {
    if (state === 'question' || state === 'feedback') {
      const session: QuizSessionState = {
        currentQuestionIndex,
        answers,
        startTime: startTimeRef.current,
      };
      sessionStorage.setItem(QUIZ_SESSION_KEY(chapterId), JSON.stringify(session));
    } else if (state === 'results' || state === 'intro') {
      sessionStorage.removeItem(QUIZ_SESSION_KEY(chapterId));
    }
  }, [state, currentQuestionIndex, answers, chapterId]);

  const resetQuiz = useCallback(() => {
    setState('intro');
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setShowExplanation(false);
    setHasSavedAttempt(false);
    setShowConfetti(false);
    setShakeWrong(false);
    startTimeRef.current = 0;
    sessionStorage.removeItem(QUIZ_SESSION_KEY(chapterId));
  }, [chapterId]);

  const startQuiz = useCallback(() => {
    startTimeRef.current = Date.now();
    setState('question');
  }, []);

  const submitAnswer = useCallback(() => {
    if (!currentQuestion) return;

    const qType = getQuestionType(currentQuestion);
    let isCorrect = false;
    let selectedId = '';

    if (qType === 'ordering') {
      isCorrect = isOrderingCorrect(orderedItems, currentQuestion.correctOrder ?? []);
      selectedId = orderedItems.join(',');
    } else {
      if (!selectedOption) return;
      isCorrect = selectedOption === currentQuestion.correctOptionId;
      selectedId = selectedOption;
    }

    const answer: Answer = {
      questionId: currentQuestion.id,
      selectedOptionId: selectedId,
      isCorrect,
    };

    setAnswers(prev => [...prev, answer]);
    setShowExplanation(true);
    setState('feedback');

    // Trigger animations
    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    } else {
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 600);
    }
  }, [selectedOption, currentQuestion, orderedItems]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setState('question');
    } else {
      setState('results');
    }
  }, [currentQuestionIndex, totalQuestions]);

  const score = answers.filter(a => a.isCorrect).length;
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= quiz.passingScore;

  // Calculate duration when quiz ends
  const getDurationSeconds = useCallback(() => {
    if (!startTimeRef.current) return undefined;
    return Math.round((Date.now() - startTimeRef.current) / 1000);
  }, []);

  // Save quiz attempt and call onPass when results are shown
  useEffect(() => {
    if (state === 'results' && !hasSavedAttempt) {
      setHasSavedAttempt(true);

      // Always save to localStorage (offline-first)
      saveQuizScore(chapterId, score, totalQuestions, passed);

      if (user) {
        saveAttempt({
          chapterId,
          score,
          totalQuestions,
          passed,
          durationSeconds: getDurationSeconds(),
        });
      }

      if (passed && onPass) {
        onPass();
      }
    }
  }, [state, hasSavedAttempt, user, saveAttempt, saveQuizScore, chapterId, score, totalQuestions, passed, getDurationSeconds, onPass]);

  // Check if this is a new best score
  const isNewBest = bestScore ? score > bestScore.score : (user && score > 0);

  // Can submit? depends on question type
  const canSubmit = currentQType === 'ordering' ? orderedItems.length > 0 : !!selectedOption;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl overflow-hidden relative"
    >
      {/* Confetti overlay */}
      {showConfetti && <ConfettiParticles color={chapterColor} />}

      {/* Header */}
      <div className="p-4 border-b border-dark-700 flex items-center justify-between">
        <h3 className="font-semibold text-dark-50 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary-400" />
          {quiz.title}
        </h3>
        {state !== 'intro' && state !== 'results' && (
          <div className="flex items-center gap-3">
            {/* Running score indicator */}
            <span className="text-sm font-medium" style={{ color: chapterColor }}>
              {answers.filter(a => a.isCorrect).length}/{answers.length}
            </span>
            <span className="text-sm text-dark-400">
              Q{currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* ───── Intro Screen ───── */}
          {state === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${chapterColor}20` }}
              >
                <HelpCircle className="w-8 h-8" style={{ color: chapterColor }} />
              </div>
              <h4 className="text-xl font-semibold text-dark-50 mb-2">
                Ready to Test Your Knowledge?
              </h4>
              <p className="text-dark-400 mb-6 max-w-md mx-auto">
                {quiz.description}
              </p>
              <div className="flex justify-center gap-4 mb-6">
                <div className="glass rounded-lg px-4 py-2">
                  <span className="text-2xl font-bold text-dark-50">{totalQuestions}</span>
                  <span className="text-dark-400 text-sm ml-1">questions</span>
                </div>
                <div className="glass rounded-lg px-4 py-2">
                  <span className="text-2xl font-bold text-dark-50">{quiz.passingScore}%</span>
                  <span className="text-dark-400 text-sm ml-1">to pass</span>
                </div>
              </div>

              {/* Question type badges preview */}
              {quiz.questions.some(q => q.type && q.type !== 'multiple-choice') && (
                <div className="flex justify-center gap-2 mb-6 flex-wrap">
                  {getUniqueTypes(quiz.questions).map(t => (
                    <QuestionTypeBadge key={t} type={t} />
                  ))}
                </div>
              )}

              {/* Show previous attempts info if user is logged in */}
              {user && bestScore && (
                <div className="glass rounded-xl p-4 mb-6 max-w-sm mx-auto">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-dark-400">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>Best Score</span>
                    </div>
                    <span className="text-dark-50 font-medium">
                      {formatQuizScore(bestScore.score, bestScore.total_questions)}
                    </span>
                  </div>
                  {attemptCount > 0 && (
                    <div className="flex items-center justify-between text-sm mt-2">
                      <div className="flex items-center gap-2 text-dark-400">
                        <Clock className="w-4 h-4" />
                        <span>Attempts</span>
                      </div>
                      <span className="text-dark-50 font-medium">{attemptCount}</span>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={startQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-dark-50 font-medium transition-all hover:opacity-90 hover:scale-105 active:scale-95"
                style={{ backgroundColor: chapterColor }}
              >
                {attemptCount > 0 ? 'Retake Quiz' : 'Start Quiz'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* ───── Question Screen ───── */}
          {state === 'question' && currentQuestion && (
            <motion.div
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Progress bar with segments */}
              <div className="mb-6">
                <div className="flex gap-1 h-2">
                  {quiz.questions.map((_, idx) => (
                    <div
                      key={idx}
                      className="flex-1 rounded-full overflow-hidden bg-dark-700"
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor:
                            idx < answers.length
                              ? answers[idx]?.isCorrect
                                ? '#10b981'
                                : '#ef4444'
                              : idx === currentQuestionIndex
                              ? chapterColor
                              : 'transparent',
                        }}
                        initial={idx === currentQuestionIndex ? { width: '0%' } : undefined}
                        animate={{ width: idx <= currentQuestionIndex ? '100%' : '0%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <QuestionTypeBadge type={currentQType} />

              <h4 className="text-lg font-semibold text-dark-50 mb-4">
                {currentQuestion.question}
              </h4>

              {/* Code snippet if present */}
              {currentQuestion.codeSnippet && (
                <QuestionCodeSnippet code={currentQuestion.codeSnippet} />
              )}

              {/* Render by question type */}
              <div className="mb-6">
                {currentQType === 'ordering' ? (
                  <OrderingQuestion
                    question={currentQuestion}
                    orderedItems={orderedItems}
                    onReorder={setOrderedItems}
                    chapterColor={chapterColor}
                  />
                ) : (
                  <ChoiceQuestion
                    question={currentQuestion}
                    selectedOption={selectedOption}
                    onSelect={setSelectedOption}
                  />
                )}
              </div>

              <button
                onClick={submitAnswer}
                disabled={!canSubmit}
                className="w-full py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
                style={{
                  backgroundColor: canSubmit ? chapterColor : undefined,
                  color: canSubmit ? 'white' : undefined,
                }}
              >
                Submit Answer
              </button>
            </motion.div>
          )}

          {/* ───── Feedback Screen ───── */}
          {state === 'feedback' && currentQuestion && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Progress bar with segments */}
              <div className="mb-6">
                <div className="flex gap-1 h-2">
                  {quiz.questions.map((_, idx) => (
                    <div key={idx} className="flex-1 rounded-full overflow-hidden bg-dark-700">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor:
                            idx < answers.length
                              ? answers[idx]?.isCorrect
                                ? '#10b981'
                                : '#ef4444'
                              : 'transparent',
                        }}
                        animate={{ width: idx < answers.length ? '100%' : '0%' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <ShakeWrapper shake={shakeWrong}>
                <div
                  className={`p-4 rounded-xl mb-6 ${
                    answers[answers.length - 1]?.isCorrect
                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                      : 'bg-red-500/10 border border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {answers[answers.length - 1]?.isCorrect ? (
                      <>
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        >
                          <CheckCircle className="w-6 h-6 text-emerald-500" />
                        </motion.div>
                        <span className="font-semibold text-emerald-400 flex items-center gap-2">
                          Correct!
                          <Sparkles className="w-4 h-4" />
                        </span>
                      </>
                    ) : (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <XCircle className="w-6 h-6 text-red-500" />
                        </motion.div>
                        <span className="font-semibold text-red-400">Not quite</span>
                      </>
                    )}
                  </div>

                  {/* Show correct answer for wrong answers */}
                  {!answers[answers.length - 1]?.isCorrect && currentQType !== 'ordering' && (
                    <p className="text-sm text-dark-300 mt-1">
                      Correct answer:{' '}
                      <span className="text-emerald-400 font-medium">
                        {currentQuestion.options.find(o => o.id === currentQuestion.correctOptionId)?.text}
                      </span>
                    </p>
                  )}

                  {/* Show correct order for ordering questions */}
                  {!answers[answers.length - 1]?.isCorrect && currentQType === 'ordering' && currentQuestion.correctOrder && (
                    <div className="mt-2 text-sm text-dark-300">
                      <p className="mb-1">Correct order:</p>
                      <ol className="list-decimal list-inside space-y-0.5">
                        {currentQuestion.correctOrder.map(id => (
                          <li key={id} className="text-emerald-400">
                            {currentQuestion.options.find(o => o.id === id)?.text}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </ShakeWrapper>

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-4 mb-6"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-dark-50">Explanation:</span>
                      <p className="text-dark-300 mt-1">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <button
                onClick={nextQuestion}
                className="w-full py-3 rounded-xl font-medium text-dark-50 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: chapterColor }}
              >
                {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'See Results'}
              </button>
            </motion.div>
          )}

          {/* ───── Results Screen ───── */}
          {state === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 relative"
            >
              {/* Results confetti for passing */}
              {passed && <ConfettiParticles color={chapterColor} />}

              <motion.div
                className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
                  passed ? 'bg-emerald-500/20' : 'bg-red-500/20'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
              >
                {passed ? (
                  <Award className="w-10 h-10 text-emerald-500" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-500" />
                )}
              </motion.div>

              <h4 className="text-2xl font-bold text-dark-50 mb-2">
                {passed ? 'Congratulations!' : 'Keep Learning!'}
              </h4>

              <p className="text-dark-400 mb-4">
                {passed
                  ? "You've passed this quiz and mastered the key concepts."
                  : `You need ${quiz.passingScore}% to pass. Review the material and try again.`}
              </p>

              {/* New best score badge */}
              {isNewBest && user && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 mb-4"
                >
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-medium text-sm">New Best Score!</span>
                </motion.div>
              )}

              {/* Score card with per-question breakdown */}
              <div className="glass rounded-xl p-6 mb-6 max-w-sm mx-auto">
                <motion.div
                  className="text-4xl font-bold text-dark-50 mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {percentage}%
                </motion.div>
                <div className="text-dark-400">
                  {score} of {totalQuestions} correct
                </div>

                {/* Segmented results bar */}
                <div className="mt-4 flex gap-1 h-3">
                  {answers.map((a, idx) => (
                    <motion.div
                      key={idx}
                      className={`flex-1 rounded-full ${a.isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.4 + idx * 0.1, duration: 0.3 }}
                    />
                  ))}
                </div>

                {/* Per-question result icons */}
                <div className="mt-3 flex justify-center gap-2 flex-wrap">
                  {answers.map((a, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + idx * 0.08 }}
                      title={`Q${idx + 1}: ${a.isCorrect ? 'Correct' : 'Wrong'}`}
                    >
                      {a.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Show saving indicator */}
                {saving && (
                  <div className="mt-3 text-xs text-dark-400 flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                    Saving result...
                  </div>
                )}

                {/* Show attempt count */}
                {user && attemptCount > 0 && !saving && (
                  <div className="mt-3 text-xs text-dark-400">
                    Attempt #{attemptCount + 1} saved
                  </div>
                )}
              </div>

              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-700 text-dark-50 font-medium hover:bg-dark-600 transition-all hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
                {passed ? 'Retake Quiz' : 'Try Again'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Utility: shuffle array (Fisher-Yates) ──────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ─── Utility: get unique question types in a quiz ───────────────────────
function getUniqueTypes(questions: QuizQuestion[]): QuizQuestionType[] {
  const types = new Set(questions.map(q => getQuestionType(q)));
  return Array.from(types);
}
