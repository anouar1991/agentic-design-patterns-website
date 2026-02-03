import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Trophy
} from 'lucide-react';
import type { ChapterQuiz as ChapterQuizType } from '../data/types';
import { useQuizAttempts, formatQuizScore } from '../hooks/useQuizAttempts';
import { useAuth } from '../contexts/AuthContext';

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

export default function ChapterQuiz({ quiz, chapterColor, chapterId, onPass }: ChapterQuizProps) {
  const [state, setState] = useState<QuizState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasSavedAttempt, setHasSavedAttempt] = useState(false);

  // Track quiz duration
  const startTimeRef = useRef<number | null>(null);

  // Auth and quiz persistence
  const { user } = useAuth();
  const { bestScore, attemptCount, saveAttempt, saving } = useQuizAttempts(chapterId);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  const resetQuiz = useCallback(() => {
    setState('intro');
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setShowExplanation(false);
    setHasSavedAttempt(false);
    startTimeRef.current = null;
  }, []);

  const startQuiz = useCallback(() => {
    startTimeRef.current = Date.now();
    setState('question');
  }, []);

  const submitAnswer = useCallback(() => {
    if (!selectedOption || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correctOptionId;
    const answer: Answer = {
      questionId: currentQuestion.id,
      selectedOptionId: selectedOption,
      isCorrect,
    };

    setAnswers(prev => [...prev, answer]);
    setShowExplanation(true);
    setState('feedback');
  }, [selectedOption, currentQuestion]);

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

      // Save attempt to database (async, doesn't block UI)
      if (user) {
        saveAttempt({
          chapterId,
          score,
          totalQuestions,
          passed,
          durationSeconds: getDurationSeconds(),
        });
      }

      // Call onPass callback if quiz passed
      if (passed && onPass) {
        onPass();
      }
    }
  }, [state, hasSavedAttempt, user, saveAttempt, chapterId, score, totalQuestions, passed, getDurationSeconds, onPass]);

  // Check if this is a new best score
  const isNewBest = bestScore ? score > bestScore.score : (user && score > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-dark-700 flex items-center justify-between">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary-400" />
          {quiz.title}
        </h3>
        {state !== 'intro' && state !== 'results' && (
          <span className="text-sm text-dark-400">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        )}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Intro Screen */}
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
              <h4 className="text-xl font-semibold text-white mb-2">
                Ready to Test Your Knowledge?
              </h4>
              <p className="text-dark-400 mb-6 max-w-md mx-auto">
                {quiz.description}
              </p>
              <div className="flex justify-center gap-4 mb-6">
                <div className="glass rounded-lg px-4 py-2">
                  <span className="text-2xl font-bold text-white">{totalQuestions}</span>
                  <span className="text-dark-400 text-sm ml-1">questions</span>
                </div>
                <div className="glass rounded-lg px-4 py-2">
                  <span className="text-2xl font-bold text-white">{quiz.passingScore}%</span>
                  <span className="text-dark-400 text-sm ml-1">to pass</span>
                </div>
              </div>

              {/* Show previous attempts info if user is logged in */}
              {user && bestScore && (
                <div className="glass rounded-xl p-4 mb-6 max-w-sm mx-auto">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-dark-400">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>Best Score</span>
                    </div>
                    <span className="text-white font-medium">
                      {formatQuizScore(bestScore.score, bestScore.total_questions)}
                    </span>
                  </div>
                  {attemptCount > 0 && (
                    <div className="flex items-center justify-between text-sm mt-2">
                      <div className="flex items-center gap-2 text-dark-400">
                        <Clock className="w-4 h-4" />
                        <span>Attempts</span>
                      </div>
                      <span className="text-white font-medium">{attemptCount}</span>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={startQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: chapterColor }}
              >
                {attemptCount > 0 ? 'Retake Quiz' : 'Start Quiz'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Question Screen */}
          {state === 'question' && currentQuestion && (
            <motion.div
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Progress bar */}
              <div className="mb-6">
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: chapterColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              <h4 className="text-lg font-semibold text-white mb-6">
                {currentQuestion.question}
              </h4>

              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedOption === option.id
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-600 hover:border-dark-500 bg-dark-800/50'
                    }`}
                  >
                    <span className="text-dark-200">{option.text}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={submitAnswer}
                disabled={!selectedOption}
                className="w-full py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: selectedOption ? chapterColor : undefined,
                  color: selectedOption ? 'white' : undefined,
                }}
              >
                Submit Answer
              </button>
            </motion.div>
          )}

          {/* Feedback Screen */}
          {state === 'feedback' && currentQuestion && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Progress bar */}
              <div className="mb-6">
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: chapterColor }}
                    initial={{ width: `${((currentQuestionIndex) / totalQuestions) * 100}%` }}
                    animate={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              <div className={`p-4 rounded-xl mb-6 ${
                answers[answers.length - 1]?.isCorrect
                  ? 'bg-emerald-500/10 border border-emerald-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {answers[answers.length - 1]?.isCorrect ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                      <span className="font-semibold text-emerald-400">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-500" />
                      <span className="font-semibold text-red-400">Incorrect</span>
                    </>
                  )}
                </div>
              </div>

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-4 mb-6"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-white">Explanation:</span>
                      <p className="text-dark-300 mt-1">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <button
                onClick={nextQuestion}
                className="w-full py-3 rounded-xl font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: chapterColor }}
              >
                {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'See Results'}
              </button>
            </motion.div>
          )}

          {/* Results Screen */}
          {state === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <div
                className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
                  passed ? 'bg-emerald-500/20' : 'bg-red-500/20'
                }`}
              >
                {passed ? (
                  <Award className="w-10 h-10 text-emerald-500" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-500" />
                )}
              </div>

              <h4 className="text-2xl font-bold text-white mb-2">
                {passed ? 'Congratulations!' : 'Keep Learning!'}
              </h4>

              <p className="text-dark-400 mb-4">
                {passed
                  ? 'You\'ve passed this quiz and mastered the key concepts.'
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

              <div className="glass rounded-xl p-6 mb-6 max-w-xs mx-auto">
                <div className="text-4xl font-bold text-white mb-1">{percentage}%</div>
                <div className="text-dark-400">
                  {score} of {totalQuestions} correct
                </div>
                <div className="mt-4 h-3 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${passed ? 'bg-emerald-500' : 'bg-red-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-700 text-white font-medium hover:bg-dark-600 transition-colors"
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
