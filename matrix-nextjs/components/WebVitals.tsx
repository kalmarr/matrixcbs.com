'use client'

import { useEffect } from 'react'
import { onCLS, onLCP, onTTFB, onINP, type Metric } from 'web-vitals'

export function WebVitals() {
  useEffect(() => {
    function sendToAnalytics(metric: Metric) {
      // Get rating based on metric thresholds
      const rating = getRating(metric)

      // Prepare the data to send
      const body = {
        metric: metric.name,
        value: metric.value,
        rating,
        path: window.location.pathname,
        userAgent: navigator.userAgent,
      }

      // Send to API endpoint using sendBeacon (non-blocking)
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(body)], {
          type: 'application/json',
        })
        navigator.sendBeacon('/api/analytics/web-vitals', blob)
      } else {
        // Fallback to fetch for older browsers
        fetch('/api/analytics/web-vitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          keepalive: true,
        }).catch((err) => {
          // Silently fail - don't disrupt user experience
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to send web vital:', err)
          }
        })
      }
    }

    // Register all Web Vitals metrics
    // Note: FID was deprecated in web-vitals v4, INP is now the standard
    onCLS(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
    onINP(sendToAnalytics)
  }, [])

  return null
}

// Get rating based on Web Vitals thresholds
function getRating(metric: Metric): string {
  const { name, value } = metric

  switch (name) {
    case 'LCP':
      // Largest Contentful Paint
      // Good: <= 2500ms, Needs improvement: <= 4000ms, Poor: > 4000ms
      if (value <= 2500) return 'good'
      if (value <= 4000) return 'needs-improvement'
      return 'poor'

    case 'CLS':
      // Cumulative Layout Shift
      // Good: <= 0.1, Needs improvement: <= 0.25, Poor: > 0.25
      if (value <= 0.1) return 'good'
      if (value <= 0.25) return 'needs-improvement'
      return 'poor'

    case 'TTFB':
      // Time to First Byte
      // Good: <= 800ms, Needs improvement: <= 1800ms, Poor: > 1800ms
      if (value <= 800) return 'good'
      if (value <= 1800) return 'needs-improvement'
      return 'poor'

    case 'INP':
      // Interaction to Next Paint (replaced FID in 2024)
      // Good: <= 200ms, Needs improvement: <= 500ms, Poor: > 500ms
      if (value <= 200) return 'good'
      if (value <= 500) return 'needs-improvement'
      return 'poor'

    default:
      return 'unknown'
  }
}
