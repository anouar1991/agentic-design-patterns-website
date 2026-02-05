import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useState } from 'react';
import type { QuizAttempt, BestQuizScore } from '../lib/database.types';
import { formatQuizScore } from '../hooks/useQuizAttempts';

interface QuizHistoryProps {
  attempts: QuizAttempt[];
  bestScore: BestQuizScore | null;
  loading: boolean;
  chapterColor: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatDuration(seconds: number | null): string | null {
  if (!seconds) return null;
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

function getTrend(current: QuizAttempt, previous: QuizAttempt | undefined) {
  if (!previous) return null;
  const currentPct = (current.score / current.total_questions) * 100;
  const previousPct = (previous.score / previous.total_questions) * 100;
  const diff = currentPct - previousPct;
  if (diff > 0) return { direction: 'up' as const, amount: Math.round(diff) };
  if (diff < 0) return { direction: 'down' as const, amount: Math.round(Math.abs(diff)) };
  return { direction: 'same' as const, amount: 0 };
}

const MAX_VISIBLE = 3;

export default memo(function QuizHistory({ attempts, bestScore, loading, chapterColor }: QuizHistoryProps) {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className="mt-4 glass rounded-xl p-4">
        <div className="flex items-center gap-2 text-dark-400 text-sm">
          <div className="w-4 h-4 border-2 border-dark-500 border-t-transparent rounded-full animate-spin" />
          Loading history...
        </div>
      </div>
    );
  }

  if (attempts.length === 0) return null;

  // Attempts are already sorted by created_at desc from the hook
  const visibleAttempts = expanded ? attempts : attempts.slice(0, MAX_VISIBLE);
  const hasMore = attempts.length > MAX_VISIBLE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-6"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-dark-200 dark:text-dark-200 flex items-center gap-2">
          <Clock className="w-4 h-4 text-dark-400" />
          Quiz History
          <span className="text-dark-500 font-normal">({attempts.length} attempt{attempts.length !== 1 ? 's' : ''})</span>
        </h4>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {visibleAttempts.map((attempt, idx) => {
            const isBest = bestScore && attempt.id === findBestAttemptId(attempts, bestScore);
            const percentage = Math.round((attempt.score / attempt.total_questions) * 100);
            // For trend, compare with the next item (which is the previous attempt chronologically)
            const previousAttempt = attempts[attempts.indexOf(attempt) + 1];
            const trend = getTrend(attempt, previousAttempt);
            const duration = formatDuration(attempt.duration_seconds);

            return (
              <motion.div
                key={attempt.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`rounded-xl border p-3 transition-colors ${
                  isBest
                    ? 'border-amber-500/40 bg-amber-500/5 dark:border-amber-500/40 dark:bg-amber-500/5'
                    : 'border-dark-700 bg-dark-800/30 dark:border-dark-700 dark:bg-dark-800/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Attempt number */}
                    <span
                      className="flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0"
                      style={{
                        backgroundColor: isBest ? 'rgba(245, 158, 11, 0.2)' : `${chapterColor}20`,
                        color: isBest ? '#f59e0b' : chapterColor,
                      }}
                    >
                      #{attempt.attempt_number}
                    </span>

                    {/* Score */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${
                          attempt.passed ? 'text-emerald-400' : 'text-dark-300'
                        }`}>
                          {formatQuizScore(attempt.score, attempt.total_questions)}
                        </span>
                        {isBest && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400">
                            <Trophy className="w-3 h-3" />
                            Best
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-dark-500">
                        <span>{formatDate(attempt.created_at)}</span>
                        {duration && (
                          <>
                            <span>·</span>
                            <span>{duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Trend indicator */}
                  <div className="flex items-center gap-2">
                    {trend && (
                      <span className={`flex items-center gap-0.5 text-xs ${
                        trend.direction === 'up' ? 'text-emerald-400' :
                        trend.direction === 'down' ? 'text-red-400' : 'text-dark-500'
                      }`}>
                        {trend.direction === 'up' && <TrendingUp className="w-3 h-3" />}
                        {trend.direction === 'down' && <TrendingDown className="w-3 h-3" />}
                        {trend.direction === 'same' && <Minus className="w-3 h-3" />}
                        {trend.amount > 0 && `${trend.amount}%`}
                      </span>
                    )}

                    {/* Score bar */}
                    <div className="w-16 h-1.5 rounded-full bg-dark-700 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: attempt.passed ? '#10b981' : chapterColor,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Show more/less toggle */}
      {hasMore && (
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="mt-2 w-full flex items-center justify-center gap-1 py-2 text-xs text-dark-400 hover:text-dark-300 transition-colors"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              Show all {attempts.length} attempts <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      )}
    </motion.div>
  );
});

// Find the attempt ID that matches the best score
function findBestAttemptId(attempts: QuizAttempt[], bestScore: BestQuizScore): string | null {
  // Match by attempt_number and chapter_id
  const match = attempts.find(
    a => a.attempt_number === bestScore.attempt_number && a.chapter_id === bestScore.chapter_id
  );
  return match?.id ?? null;
}
