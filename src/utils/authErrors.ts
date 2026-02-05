/**
 * Sanitize Supabase auth error messages to prevent user enumeration.
 * Maps specific error messages to generic ones that don't reveal
 * whether an email address is registered.
 */

const GENERIC_LOGIN_ERROR = 'Invalid email or password'
const GENERIC_SIGNUP_ERROR = 'Unable to create account. Please try again.'
const RATE_LIMIT_ERROR = 'Too many attempts. Please wait a moment before trying again.'

const ERROR_MAP: Record<string, string> = {
  // Login errors — normalize to prevent user enumeration
  'Invalid login credentials': GENERIC_LOGIN_ERROR,
  'Email not confirmed': 'Please check your email for a confirmation link.',
  'Invalid Refresh Token: Refresh Token Not Found': 'Your session has expired. Please sign in again.',
  'User not found': GENERIC_LOGIN_ERROR,

  // Signup errors
  'User already registered': GENERIC_SIGNUP_ERROR,
  'A user with this email address has already been registered': GENERIC_SIGNUP_ERROR,

  // Rate limiting
  'For security purposes, you can only request this after': RATE_LIMIT_ERROR,
  'Email rate limit exceeded': RATE_LIMIT_ERROR,
  'Rate limit exceeded': RATE_LIMIT_ERROR,
}

export function sanitizeAuthError(message: string): string {
  // Check for exact matches first
  if (ERROR_MAP[message]) return ERROR_MAP[message]

  // Check for partial matches (some Supabase errors include dynamic content)
  for (const [pattern, sanitized] of Object.entries(ERROR_MAP)) {
    if (message.includes(pattern)) return sanitized
  }

  // For unknown errors, return a generic message to avoid leaking internals
  if (message.toLowerCase().includes('rate limit')) return RATE_LIMIT_ERROR

  return message
}

/**
 * Auth rate limiter — prevents rapid form submissions client-side.
 * This is defense-in-depth; Supabase also rate-limits server-side.
 */
const AUTH_COOLDOWN_MS = 2000

export function createAuthRateLimiter() {
  let lastAttempt = 0

  return {
    canAttempt(): boolean {
      return Date.now() - lastAttempt >= AUTH_COOLDOWN_MS
    },
    recordAttempt(): void {
      lastAttempt = Date.now()
    },
    getRemainingCooldown(): number {
      return Math.max(0, AUTH_COOLDOWN_MS - (Date.now() - lastAttempt))
    },
  }
}
