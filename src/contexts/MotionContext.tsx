/**
 * Motion Context Provider
 *
 * Wraps the application with Framer Motion configuration and provides
 * global motion state (like route transition status) to child components.
 */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { MotionConfig } from 'framer-motion';

interface MotionContextType {
  /** Whether a route transition is currently in progress */
  isRouteTransitioning: boolean;
  /** Signal that a route transition has started */
  setRouteTransitioning: (transitioning: boolean) => void;
  /** Whether the user prefers reduced motion (derived from MotionConfig) */
  reducedMotion: boolean;
}

const MotionContext = createContext<MotionContextType | null>(null);

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);

  // Check if user prefers reduced motion
  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const setRouteTransitioning = useCallback((transitioning: boolean) => {
    setIsRouteTransitioning(transitioning);
  }, []);

  const value = useMemo(
    () => ({
      isRouteTransitioning,
      setRouteTransitioning,
      reducedMotion,
    }),
    [isRouteTransitioning, setRouteTransitioning, reducedMotion]
  );

  return (
    <MotionContext.Provider value={value}>
      {/*
        MotionConfig wraps all Framer Motion components with shared settings.
        reducedMotion="user" respects the user's OS preference for reduced motion.
      */}
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </MotionContext.Provider>
  );
}

/**
 * Hook to access motion context
 * @returns Motion context with transition state and preferences
 */
export function useMotion(): MotionContextType {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error('useMotion must be used within a MotionProvider');
  }
  return context;
}
