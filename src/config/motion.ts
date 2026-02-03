/**
 * Centralized Motion Configuration
 *
 * This module provides consistent animation values across the application,
 * preventing drift and ensuring a cohesive motion language.
 */

// Duration tiers (in seconds)
export const durations = {
  fast: 0.15,    // Micro-interactions, button states
  base: 0.3,     // Standard transitions
  slow: 0.5,     // Emphasis animations
  ambient: 20,   // Background ambient motion
} as const;

// Easing presets
export const easings = {
  // Standard ease-out for most transitions
  easeOut: [0.0, 0.0, 0.2, 1] as const,
  // Ease-in-out for emphasis
  easeInOut: [0.4, 0.0, 0.2, 1] as const,
  // Spring configuration for natural movement
  spring: { type: 'spring' as const, stiffness: 400, damping: 30 },
  // Gentler spring for layout animations
  gentleSpring: { type: 'spring' as const, stiffness: 300, damping: 25 },
} as const;

// Route transition variants (scale + depth effect)
export const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 10,
  },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: durations.base,
      ease: easings.easeOut,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -10,
    transition: {
      duration: durations.fast,
      ease: easings.easeOut,
    },
  },
} as const;

// Fade-only variants for simpler transitions
export const fadeVariants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: { duration: durations.base }
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.fast }
  },
} as const;

// Shared element layoutId generators
// These create consistent IDs for elements that should morph across routes
export const layoutIds = {
  // Chapter icon morphs from grid (Home) -> card (Chapters) -> hero (Chapter)
  chapterIcon: (num: number) => `chapter-icon-${num}`,
  // Progress bar morphs from widget to header
  progressBar: 'global-progress-bar',
  // Navigation active indicator
  navActive: 'nav-active',
} as const;

// Stagger container variants
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
} as const;

// Stagger item variants
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.base,
      ease: easings.easeOut,
    },
  },
} as const;

// Ambient orb configurations
export const ambientOrbs = [
  {
    id: 'orb-primary',
    color: 'primary-500',
    size: 'w-96 h-96',
    position: 'top-1/4 left-1/4',
    drift: { x: 30, y: 20, duration: 20 },
  },
  {
    id: 'orb-accent',
    color: 'accent-500',
    size: 'w-96 h-96',
    position: 'bottom-1/4 right-1/4',
    drift: { x: -25, y: -15, duration: 25 },
  },
  {
    id: 'orb-secondary',
    color: 'primary-400',
    size: 'w-64 h-64',
    position: 'top-1/2 right-1/3',
    drift: { x: 15, y: -25, duration: 30 },
  },
] as const;

// ============================================
// Enhanced Learning Experience Variants
// ============================================

// Section reveal on scroll (for progressive content)
export const sectionReveal = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: durations.slow,
      ease: easings.easeOut,
    },
  },
} as const;

// Code block reveal (line by line feel)
export const codeReveal = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.base,
      ease: easings.easeOut,
    },
  },
} as const;

// Node selection animation for diagrams
export const nodeSelect = {
  inactive: {
    scale: 1,
    filter: 'brightness(0.85)',
  },
  active: {
    scale: 1.05,
    filter: 'brightness(1.1)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
} as const;

// Slide panel (for node detail panel)
export const slidePanel = {
  hidden: {
    x: '100%',
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: durations.fast,
      ease: easings.easeOut,
    },
  },
} as const;

// Tooltip pop-in
export const tooltipPop = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: durations.fast,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.95,
    transition: {
      duration: durations.fast,
    },
  },
} as const;

// Celebration confetti burst
export const celebrationBurst = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15,
    },
  },
} as const;

// Progress bar fill
export const progressFill = {
  hidden: { scaleX: 0 },
  visible: (progress: number) => ({
    scaleX: progress,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 30,
    },
  }),
} as const;

// Glow pulse for interactive elements
export const glowPulse = {
  initial: {
    boxShadow: '0 0 0 rgba(var(--color), 0)',
  },
  pulse: {
    boxShadow: [
      '0 0 0 rgba(var(--color), 0)',
      '0 0 20px rgba(var(--color), 0.3)',
      '0 0 0 rgba(var(--color), 0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
} as const;
