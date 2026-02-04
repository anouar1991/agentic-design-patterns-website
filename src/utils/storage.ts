/**
 * Safe localStorage wrappers with graceful degradation.
 *
 * Handles: private browsing (storage unavailable), corrupt JSON,
 * quota exceeded, and any unexpected errors. Logs issues via
 * the structured logger and returns fallback values instead of throwing.
 */

import { createLogger } from './logger'

const log = createLogger('Storage')

/** Check whether localStorage is available at all (e.g. private browsing). */
function isAvailable(): boolean {
  try {
    const key = '__storage_test__'
    localStorage.setItem(key, '1')
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

/** Cached availability check — evaluated once per session. */
let available: boolean | null = null
function storageAvailable(): boolean {
  if (available === null) {
    available = isAvailable()
    if (!available) {
      log.warn('localStorage is not available — running without persistence')
    }
  }
  return available
}

/**
 * Safely read a raw string from localStorage.
 * Returns `null` if the key doesn't exist or storage is unavailable.
 */
export function safeGetItem(key: string): string | null {
  if (!storageAvailable()) return null
  try {
    return localStorage.getItem(key)
  } catch (err) {
    log.warn('Failed to read key', key, err)
    return null
  }
}

/**
 * Safely write a raw string to localStorage.
 * Silently fails when storage is unavailable or quota is exceeded.
 */
export function safeSetItem(key: string, value: string): void {
  if (!storageAvailable()) return
  try {
    localStorage.setItem(key, value)
  } catch (err) {
    log.warn('Failed to write key', key, err)
  }
}

/**
 * Safely remove a key from localStorage.
 */
export function safeRemoveItem(key: string): void {
  if (!storageAvailable()) return
  try {
    localStorage.removeItem(key)
  } catch (err) {
    log.warn('Failed to remove key', key, err)
  }
}

/**
 * Read and parse JSON from localStorage with validation.
 *
 * @param key       Storage key
 * @param fallback  Value returned when key is missing, corrupt, or storage unavailable
 * @param validate  Optional guard — if it returns false, the stored value is treated as corrupt
 */
export function safeGetJSON<T>(key: string, fallback: T, validate?: (v: unknown) => boolean): T {
  const raw = safeGetItem(key)
  if (raw === null) return fallback

  try {
    const parsed: unknown = JSON.parse(raw)
    if (validate && !validate(parsed)) {
      log.warn('Stored data failed validation for key', key, '— using fallback')
      return fallback
    }
    return parsed as T
  } catch (err) {
    log.warn('Corrupt JSON in key', key, err)
    return fallback
  }
}

/**
 * Serialize and write JSON to localStorage.
 */
export function safeSetJSON(key: string, value: unknown): void {
  try {
    safeSetItem(key, JSON.stringify(value))
  } catch (err) {
    log.warn('Failed to serialize value for key', key, err)
  }
}
