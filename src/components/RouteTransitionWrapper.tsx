/**
 * Route Transition Wrapper
 *
 * Orchestrates page transitions with AnimatePresence, providing smooth
 * enter/exit animations for route changes. This component wraps the
 * Outlet and manages the animation lifecycle.
 *
 * Features:
 * - Scale + opacity + y-offset transition for depth effect
 * - Signals transition state to ambient background
 * - Centralized transition handling (pages don't need their own keys)
 */
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotion } from '../contexts/MotionContext';
import { pageVariants } from '../config/motion';

export default function RouteTransitionWrapper() {
  const location = useLocation();
  const { setRouteTransitioning } = useMotion();

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        // Signal that transition is complete
        setRouteTransitioning(false);
        // Scroll to top after exit animation completes
        window.scrollTo(0, 0);
      }}
    >
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        onAnimationStart={(definition) => {
          // Signal transition start when entering or exiting
          if (definition === 'initial' || definition === 'exit') {
            setRouteTransitioning(true);
          }
        }}
        onAnimationComplete={(definition) => {
          // Signal transition complete after enter animation
          if (definition === 'enter') {
            setRouteTransitioning(false);
          }
        }}
        className="min-h-[calc(100vh-4rem)]"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
