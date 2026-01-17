'use client'

// Client-side analytics wrapper
// Prevents SSR issues with hooks during static generation

import { useState, useEffect } from 'react'

export function ClientAnalytics() {
  const [mounted, setMounted] = useState(false)
  const [Analytics, setAnalytics] = useState<React.ComponentType | null>(null)
  const [Vitals, setVitals] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    setMounted(true)
    // Only load analytics on client side after mount
    import('@/components/analytics/GoogleAnalytics').then((mod) => {
      setAnalytics(() => mod.GoogleAnalytics)
    })
    import('@/components/WebVitals').then((mod) => {
      setVitals(() => mod.WebVitals)
    })
  }, [])

  if (!mounted) return null

  return (
    <>
      {Analytics && <Analytics />}
      {Vitals && <Vitals />}
    </>
  )
}
