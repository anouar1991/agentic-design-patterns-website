/**
 * Structured logger with levels and context tags.
 *
 * - Dev: all levels emitted (debug, info, warn, error)
 * - Production: only warn and error emitted
 *
 * Usage:
 *   import { createLogger } from '@/utils/logger';
 *   const log = createLogger('Router');
 *   log.debug('navigating to', path);  // suppressed in production
 *   log.error('route not found', path); // always emitted
 */

const LogLevel = {
  Debug: 0,
  Info: 1,
  Warn: 2,
  Error: 3,
} as const;

const MIN_LEVEL = import.meta.env.PROD ? LogLevel.Warn : LogLevel.Debug;

function timestamp(): string {
  return new Date().toISOString().slice(11, 23); // HH:mm:ss.SSS
}

export interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

/**
 * Create a logger scoped to a context (e.g., 'Router', 'Quiz', 'SW').
 * Each call includes a timestamp and context tag prefix.
 */
export function createLogger(context: string): Logger {
  const tag = `[${context}]`;

  return {
    debug(...args: unknown[]) {
      if (MIN_LEVEL <= LogLevel.Debug) {
        console.debug(timestamp(), tag, ...args);
      }
    },
    info(...args: unknown[]) {
      if (MIN_LEVEL <= LogLevel.Info) {
        console.info(timestamp(), tag, ...args);
      }
    },
    warn(...args: unknown[]) {
      if (MIN_LEVEL <= LogLevel.Warn) {
        console.warn(timestamp(), tag, ...args);
      }
    },
    error(...args: unknown[]) {
      if (MIN_LEVEL <= LogLevel.Error) {
        console.error(timestamp(), tag, ...args);
      }
    },
  };
}

/** Default app-level logger */
export const log = createLogger('App');
