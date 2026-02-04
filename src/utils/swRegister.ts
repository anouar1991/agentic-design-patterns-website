import { registerSW } from 'virtual:pwa-register'
import { createLogger } from './logger'

const log = createLogger('SW')

/**
 * Register the service worker with structured lifecycle logging.
 *
 * Lifecycle events logged:
 * - Registration success/failure (info/error)
 * - Offline-ready notification (info)
 * - Update available notification (warn)
 *
 * Cache-hit detail is logged at debug level (suppressed in production).
 */
export function initServiceWorker(): void {
  if (!('serviceWorker' in navigator)) {
    log.warn('Service workers not supported in this browser')
    return
  }

  log.debug('Initiating service worker registration…')

  registerSW({
    immediate: true,
    onRegisteredSW(swUrl, registration) {
      log.info('Registered:', swUrl)
      if (registration) {
        log.debug('Scope:', registration.scope)
        log.debug('State:', registration.active?.state ?? 'no active worker')
      }
    },
    onOfflineReady() {
      log.info('Offline ready — all assets cached')
    },
    onNeedRefresh() {
      log.warn('New content available — page will auto-update on next visit')
    },
    onRegisterError(error: unknown) {
      log.error('Registration failed:', error)
    },
  })
}
