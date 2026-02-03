/**
 * ReadingProgressBar
 *
 * A slim progress bar fixed at the top of the page that shows
 * how far the user has scrolled through the chapter content.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Clock } from 'lucide-react';

interface ReadingProgressBarProps {
  chapterColor: string;
  estimatedMinutes?: number;
}

export default function ReadingProgressBar({
  chapterColor,
  estimatedMinutes,
}: ReadingProgressBarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafId = useRef<number | null>(null);

  // Use spring animation for smooth progress updates
  const springProgress = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    springProgress.set(scrollProgress);
  }, [scrollProgress, springProgress]);

  // Calculate scroll progress
  useEffect(() => {
    const calculateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
      setScrollProgress(progress);
    };

    const handleScroll = () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(calculateProgress);
    };

    // Initial calculation
    calculateProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateProgress);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateProgress);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Calculate remaining time based on progress
  const remainingMinutes = estimatedMinutes
    ? Math.max(1, Math.ceil(estimatedMinutes * (1 - scrollProgress)))
    : null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-1.5 bg-dark-800/80 backdrop-blur-sm">
      {/* Progress bar */}
      <motion.div
        className="h-full origin-left"
        style={{
          backgroundColor: chapterColor,
          scaleX: springProgress,
          boxShadow: `0 0 10px ${chapterColor}60`,
        }}
      />

      {/* Reading time indicator (appears after scrolling a bit) */}
      {estimatedMinutes && scrollProgress > 0.05 && scrollProgress < 0.95 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-4 top-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-dark-800/90 backdrop-blur-sm text-xs text-dark-300"
        >
          <Clock className="w-3 h-3" />
          <span>~{remainingMinutes} min left</span>
        </motion.div>
      )}

      {/* Completion indicator */}
      {scrollProgress >= 0.95 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-4 top-3 flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium"
          style={{ backgroundColor: `${chapterColor}20`, color: chapterColor }}
        >
          Complete!
        </motion.div>
      )}
    </div>
  );
}

/**
 * Hook to get current reading progress
 */
export function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(Math.min(Math.max(scrollTop / docHeight, 0), 1));
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return progress;
}
