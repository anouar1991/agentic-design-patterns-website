/**
 * Ambient Background Component
 *
 * Creates a persistent animated background with floating blur orbs.
 * This component lives in the Layout and never unmounts, providing
 * spatial continuity during route transitions.
 *
 * Features:
 * - Slow-drifting blur orbs (20-30s animation loops)
 * - Pauses during route transitions to reduce visual noise
 * - Respects reduced motion preferences via MotionConfig
 */
import { motion } from 'framer-motion';
import { useMotion } from '../contexts/MotionContext';

interface OrbConfig {
  id: string;
  color: string;
  size: string;
  initialPosition: { x: string; y: string };
  drift: { x: number; y: number; duration: number };
}

const orbs: OrbConfig[] = [
  {
    id: 'orb-primary',
    color: 'bg-primary-500/20',
    size: 'w-96 h-96',
    initialPosition: { x: '25%', y: '25%' },
    drift: { x: 30, y: 20, duration: 20 },
  },
  {
    id: 'orb-accent',
    color: 'bg-accent-500/20',
    size: 'w-96 h-96',
    initialPosition: { x: '75%', y: '75%' },
    drift: { x: -25, y: -15, duration: 25 },
  },
  {
    id: 'orb-secondary',
    color: 'bg-primary-400/15',
    size: 'w-64 h-64',
    initialPosition: { x: '66%', y: '50%' },
    drift: { x: 15, y: -25, duration: 30 },
  },
];

function AmbientOrb({ config }: { config: OrbConfig }) {
  const { isRouteTransitioning, reducedMotion } = useMotion();

  // Create the keyframe animation values
  const { x, y, duration } = config.drift;

  // When transitioning or reduced motion, pause the animation
  const shouldAnimate = !isRouteTransitioning && !reducedMotion;

  return (
    <motion.div
      className={`absolute ${config.size} ${config.color} rounded-full blur-3xl pointer-events-none`}
      style={{
        left: config.initialPosition.x,
        top: config.initialPosition.y,
        transform: 'translate(-50%, -50%)',
      }}
      animate={
        shouldAnimate
          ? {
              x: [0, x, 0, -x * 0.5, 0],
              y: [0, y, -y * 0.5, y * 0.3, 0],
            }
          : { x: 0, y: 0 }
      }
      transition={
        shouldAnimate
          ? {
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : { duration: 0.3 }
      }
    />
  );
}

export default function AmbientBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pattern-grid opacity-50" />

      {/* Animated orbs */}
      {orbs.map((orb) => (
        <AmbientOrb key={orb.id} config={orb} />
      ))}
    </div>
  );
}
