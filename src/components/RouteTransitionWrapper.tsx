/**
 * Route Transition Wrapper
 *
 * Wraps route content with smooth fade+slide transitions on navigation.
 * Detects navigation direction (forward vs. back) to apply contextual
 * slide direction. Manages scroll position: scrolls to top on forward
 * navigation, restores previous position on back/forward browser buttons.
 *
 * Uses lightweight CSS transforms (GPU-composited) instead of Framer
 * Motion AnimatePresence to avoid the opacity-stuck state that occurs
 * with mode="wait" and complex child motion components.
 */
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useMotion } from '../contexts/MotionContext';

// Scroll positions keyed by pathname
const scrollPositions = new Map<string, number>();

export default function RouteTransitionWrapper() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const { setRouteTransitioning, reducedMotion } = useMotion();
  const [phase, setPhase] = useState<'visible' | 'exiting' | 'entering'>('visible');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const prevPathRef = useRef(location.pathname);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Save current scroll position before navigating away
  const saveScrollPosition = useCallback(() => {
    scrollPositions.set(prevPathRef.current, window.scrollY);
  }, []);

  useEffect(() => {
    if (prevPathRef.current === location.pathname) return;

    // Save scroll position of the page we're leaving
    saveScrollPosition();

    // Determine navigation direction
    const isBack = navigationType === 'POP';
    setDirection(isBack ? 'back' : 'forward');

    // Phase 1: Exit (fade out + slide)
    setRouteTransitioning(true);
    setPhase('exiting');

    // Clear any pending timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Phase 2: After exit animation, swap content and enter
    timeoutRef.current = setTimeout(() => {
      prevPathRef.current = location.pathname;

      // Handle scroll position
      if (isBack) {
        // Restore saved position for back navigation
        const savedPosition = scrollPositions.get(location.pathname) ?? 0;
        window.scrollTo(0, savedPosition);
      } else {
        // Scroll to top for forward navigation
        window.scrollTo(0, 0);
      }

      // Phase 3: Enter (fade in + slide)
      setPhase('entering');

      timeoutRef.current = setTimeout(() => {
        setPhase('visible');
        setRouteTransitioning(false);
      }, reducedMotion ? 0 : 300);
    }, reducedMotion ? 0 : 150);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [location.pathname, navigationType, setRouteTransitioning, saveScrollPosition, reducedMotion]);

  // Compute transform and opacity based on phase and direction
  const getTransitionStyle = (): React.CSSProperties => {
    if (reducedMotion) {
      return { opacity: phase === 'exiting' ? 0 : 1 };
    }

    const slideOffset = 16; // px - subtle slide distance

    switch (phase) {
      case 'exiting':
        return {
          opacity: 0,
          transform: `translateY(${direction === 'forward' ? -slideOffset : slideOffset}px)`,
        };
      case 'entering':
        return {
          opacity: 1,
          transform: 'translateY(0)',
        };
      case 'visible':
      default:
        return {
          opacity: 1,
          transform: 'translateY(0)',
        };
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-4rem)]"
      style={{
        ...getTransitionStyle(),
        transition: phase === 'exiting'
          ? 'opacity 150ms cubic-bezier(0.4, 0, 1, 1), transform 150ms cubic-bezier(0.4, 0, 1, 1)'
          : 'opacity 300ms cubic-bezier(0, 0, 0.2, 1), transform 300ms cubic-bezier(0, 0, 0.2, 1)',
        willChange: phase !== 'visible' ? 'opacity, transform' : 'auto',
      }}
    >
      <Outlet />
    </div>
  );
}
