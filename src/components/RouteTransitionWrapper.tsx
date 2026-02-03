/**
 * Route Transition Wrapper
 *
 * Wraps route content and scrolls to top on route changes.
 * Uses a lightweight CSS fade instead of framer-motion AnimatePresence
 * to avoid the opacity:0 stuck state that occurs with mode="wait"
 * and complex child motion components.
 */
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useMotion } from '../contexts/MotionContext';

export default function RouteTransitionWrapper() {
  const location = useLocation();
  const { setRouteTransitioning } = useMotion();
  const [isVisible, setIsVisible] = useState(true);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    // On route change, briefly fade out then fade in
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setRouteTransitioning(true);
      setIsVisible(false);

      // Scroll to top and fade in after a brief delay
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        setIsVisible(true);
        setRouteTransitioning(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, setRouteTransitioning]);

  return (
    <div
      className="min-h-[calc(100vh-4rem)] transition-opacity duration-300 ease-out"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <Outlet />
    </div>
  );
}
