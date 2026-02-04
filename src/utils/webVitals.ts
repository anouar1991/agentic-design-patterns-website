import type { Metric } from 'web-vitals';

/**
 * Report handler that logs in dev and can be wired to analytics in production.
 */
function sendToAnalytics(metric: Metric) {
  // In development, log to console for visibility
  if (import.meta.env.DEV) {
    const label = `[Web Vitals] ${metric.name}`;
    const value =
      metric.name === 'CLS'
        ? metric.value.toFixed(3)
        : `${Math.round(metric.value)}ms`;
    console.log(`${label}: ${value} (rating: ${metric.rating})`);
  }

  // Production: replace with your analytics endpoint
  // Example: navigator.sendBeacon('/analytics', JSON.stringify(metric));
}

/**
 * Initialize Core Web Vitals measurement.
 * Dynamically imports web-vitals so it doesn't affect the main bundle.
 */
export function reportWebVitals() {
  import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }).catch(() => {
    // web-vitals failed to load — non-critical, silently ignore
  });
}
