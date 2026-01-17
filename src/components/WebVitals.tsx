'use client'

// MATRIX CBS - Web Vitals Component
// Tracks Core Web Vitals metrics

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Only log in development or send to analytics in production
    if (process.env.NODE_ENV === 'development') {
      console.log(metric)
    }

    // Send to analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      })
    }
  })

  return null
}
