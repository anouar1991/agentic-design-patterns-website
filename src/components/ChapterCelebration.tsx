/**
 * ChapterCelebration
 *
 * A celebratory animation shown when a user completes a chapter quiz.
 * Features confetti particles and a congratulations message.
 */

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, Star, PartyPopper } from 'lucide-react';

interface ChapterCelebrationProps {
  isVisible: boolean;
  chapterTitle: string;
  chapterColor: string;
  onComplete?: () => void;
}

interface Confetti {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
}

// Confetti colors
const confettiColors = [
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#f97316', // orange
  '#14b8a6', // teal
];

export default function ChapterCelebration({
  isVisible,
  chapterTitle,
  chapterColor,
  onComplete,
}: ChapterCelebrationProps) {
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  // Generate confetti on mount
  useEffect(() => {
    if (isVisible) {
      const pieces: Confetti[] = [];
      for (let i = 0; i < 50; i++) {
        pieces.push({
          id: i,
          x: Math.random() * 100,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          delay: Math.random() * 0.5,
          rotation: Math.random() * 360,
          size: 8 + Math.random() * 8,
        });
      }
      setConfetti(pieces);

      // Show message after initial confetti burst
      const messageTimer = setTimeout(() => setShowMessage(true), 300);

      // Auto-dismiss after 4 seconds
      const dismissTimer = setTimeout(() => {
        onComplete?.();
      }, 4000);

      return () => {
        clearTimeout(messageTimer);
        clearTimeout(dismissTimer);
      };
    } else {
      setConfetti([]);
      setShowMessage(false);
    }
  }, [isVisible, onComplete]);

  const handleDismiss = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleDismiss}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" />

          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confetti.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{
                  y: -20,
                  x: `${piece.x}vw`,
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{
                  y: '110vh',
                  rotate: piece.rotation + 720,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: piece.delay,
                  ease: 'easeIn',
                }}
                className="absolute"
                style={{
                  width: piece.size,
                  height: piece.size,
                  backgroundColor: piece.color,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                }}
              />
            ))}
          </div>

          {/* Celebration message */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: -20 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="relative glass rounded-3xl p-8 max-w-md mx-4 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Trophy icon */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${chapterColor}20` }}
                >
                  <Trophy className="w-10 h-10" style={{ color: chapterColor }} />
                </motion.div>

                {/* Sparkle decorations */}
                <div className="absolute top-4 left-4">
                  <Sparkles className="w-6 h-6 text-amber-400 animate-sparkle" />
                </div>
                <div className="absolute top-4 right-4">
                  <Star className="w-5 h-5 text-amber-400 animate-sparkle" style={{ animationDelay: '0.2s' }} />
                </div>
                <div className="absolute bottom-4 left-8">
                  <PartyPopper className="w-5 h-5 text-pink-400 animate-sparkle" style={{ animationDelay: '0.4s' }} />
                </div>

                {/* Text content */}
                <h2 className="text-2xl font-bold text-dark-50 mb-2">
                  Chapter Complete!
                </h2>
                <p className="text-dark-300 mb-4">
                  You've mastered <span className="font-semibold" style={{ color: chapterColor }}>{chapterTitle}</span>
                </p>

                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-2 text-sm text-dark-400">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: chapterColor }}
                  />
                  <span>Great progress! Keep learning.</span>
                </div>

                {/* Dismiss button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDismiss}
                  className="mt-6 px-6 py-2 rounded-lg font-medium text-dark-50 transition-colors"
                  style={{ backgroundColor: chapterColor }}
                >
                  Continue
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
