// MATRIX CBS - Web Vitals Dashboard
// Teljesítménymetrikák áttekintése

// Force dynamic rendering - this page needs database access
export const dynamic = 'force-dynamic';

import { Activity } from 'lucide-react'
import prisma from '@/lib/prisma'

// Metric configuration
const METRICS = {
  LCP: {
    name: 'Legnagyobb Tartalmi Festés (LCP)',
    description: 'Az oldal legnagyobb elemének betöltési ideje',
    unit: 'ms',
    thresholds: { good: 2500, poor: 4000 },
  },
  FID: {
    name: 'Első Bemeneti Késés (FID)',
    description: 'Az első felhasználói interakcióra való reagálás ideje',
    unit: 'ms',
    thresholds: { good: 100, poor: 300 },
  },
  CLS: {
    name: 'Kumulatív Elrendezés Eltolódás (CLS)',
    description: 'Az oldal vizuális stabilitása',
    unit: '',
    thresholds: { good: 0.1, poor: 0.25 },
  },
  TTFB: {
    name: 'Első Bájtig Eltelt Idő (TTFB)',
    description: 'A szerver válaszideje',
    unit: 'ms',
    thresholds: { good: 800, poor: 1800 },
  },
  INP: {
    name: 'Interakció Következő Rajzolásig (INP)',
    description: 'Az oldal általános reakcióképessége',
    unit: 'ms',
    thresholds: { good: 200, poor: 500 },
  },
} as const

type MetricName = keyof typeof METRICS

interface MetricStats {
  metric: string
  count: number
  avg: number
  p75: number
  p95: number
  goodCount: number
  needsImprovementCount: number
  poorCount: number
}

async function getWebVitalsStats(
  metric?: string,
  days: number = 7
): Promise<MetricStats[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const where: any = {
    createdAt: {
      gte: startDate,
    },
  }

  if (metric) {
    where.metric = metric
  }

  // Get all metrics
  const metrics = await prisma.webVital.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  // Group by metric
  const grouped = metrics.reduce(
    (acc, m) => {
      if (!acc[m.metric]) {
        acc[m.metric] = []
      }
      acc[m.metric].push(m)
      return acc
    },
    {} as Record<string, typeof metrics>
  )

  // Calculate stats for each metric
  const stats: MetricStats[] = []

  for (const [metricName, values] of Object.entries(grouped)) {
    if (values.length === 0) continue

    const sorted = values.map((v) => v.value).sort((a, b) => a - b)
    const sum = sorted.reduce((a, b) => a + b, 0)
    const avg = sum / sorted.length

    // Calculate percentiles
    const p75Index = Math.floor(sorted.length * 0.75)
    const p95Index = Math.floor(sorted.length * 0.95)
    const p75 = sorted[p75Index] || 0
    const p95 = sorted[p95Index] || 0

    // Count by rating
    const goodCount = values.filter((v) => v.rating === 'good').length
    const needsImprovementCount = values.filter(
      (v) => v.rating === 'needs-improvement'
    ).length
    const poorCount = values.filter((v) => v.rating === 'poor').length

    stats.push({
      metric: metricName,
      count: values.length,
      avg,
      p75,
      p95,
      goodCount,
      needsImprovementCount,
      poorCount,
    })
  }

  return stats
}

async function getTopPaths(days: number = 7) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const metrics = await prisma.webVital.findMany({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      path: true,
      metric: true,
      value: true,
      rating: true,
    },
  })

  // Group by path
  const grouped = metrics.reduce(
    (acc, m) => {
      if (!acc[m.path]) {
        acc[m.path] = []
      }
      acc[m.path].push(m)
      return acc
    },
    {} as Record<string, typeof metrics>
  )

  // Calculate stats for each path
  const pathStats = Object.entries(grouped)
    .map(([path, values]) => ({
      path,
      count: values.length,
      goodPercent: (values.filter((v) => v.rating === 'good').length / values.length) * 100,
      poorPercent: (values.filter((v) => v.rating === 'poor').length / values.length) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return pathStats
}

function getRatingColor(
  value: number,
  metric: MetricName
): { bg: string; text: string; label: string } {
  const { thresholds } = METRICS[metric]

  if (value <= thresholds.good) {
    return {
      bg: 'bg-green-100',
      text: 'text-green-700',
      label: 'Jó',
    }
  } else if (value <= thresholds.poor) {
    return {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      label: 'Fejleszthető',
    }
  } else {
    return {
      bg: 'bg-red-100',
      text: 'text-red-700',
      label: 'Gyenge',
    }
  }
}

function formatValue(value: number, metric: MetricName): string {
  const { unit } = METRICS[metric]
  if (metric === 'CLS') {
    return value.toFixed(3)
  }
  return `${Math.round(value)}${unit}`
}

export default async function WebVitalsPage() {
  const stats = await getWebVitalsStats()
  const topPaths = await getTopPaths()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-6 h-6" />
          Web Vitals Teljesítmény
        </h1>
        <p className="text-gray-600">
          Core Web Vitals metrikák és teljesítménystatisztikák az elmúlt 7 napból
        </p>
      </div>

      {/* Metrics Overview */}
      {stats.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">
            Még nincsenek metrika adatok. A metrikák automatikusan gyűlnek az oldal
            látogatása során.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {stats.map((stat) => {
            const metricKey = stat.metric as MetricName
            const metricInfo = METRICS[metricKey]
            if (!metricInfo) return null

            const avgRating = getRatingColor(stat.avg, metricKey)
            const p75Rating = getRatingColor(stat.p75, metricKey)
            const p95Rating = getRatingColor(stat.p95, metricKey)

            const totalCount = stat.goodCount + stat.needsImprovementCount + stat.poorCount
            const goodPercent = (stat.goodCount / totalCount) * 100
            const needsImprovementPercent = (stat.needsImprovementCount / totalCount) * 100
            const poorPercent = (stat.poorCount / totalCount) * 100

            return (
              <div key={stat.metric} className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {metricInfo.name}
                      </h2>
                      <p className="text-sm text-gray-600">{metricInfo.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stat.count} mérés az elmúlt 7 napból
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${avgRating.bg} ${avgRating.text}`}>
                      {avgRating.label}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Átlag</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatValue(stat.avg, metricKey)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">75. percentilis</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatValue(stat.p75, metricKey)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p75Rating.bg} ${p75Rating.text}`}>
                      {p75Rating.label}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">95. percentilis</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatValue(stat.p95, metricKey)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p95Rating.bg} ${p95Rating.text}`}>
                      {p95Rating.label}
                    </span>
                  </div>
                </div>

                {/* Distribution bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Eloszlás</span>
                    <span>{totalCount} minta</span>
                  </div>
                  <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden flex">
                    {goodPercent > 0 && (
                      <div
                        className="bg-green-500"
                        style={{ width: `${goodPercent}%` }}
                        title={`Jó: ${stat.goodCount} (${goodPercent.toFixed(1)}%)`}
                      />
                    )}
                    {needsImprovementPercent > 0 && (
                      <div
                        className="bg-yellow-500"
                        style={{ width: `${needsImprovementPercent}%` }}
                        title={`Fejleszthető: ${stat.needsImprovementCount} (${needsImprovementPercent.toFixed(1)}%)`}
                      />
                    )}
                    {poorPercent > 0 && (
                      <div
                        className="bg-red-500"
                        style={{ width: `${poorPercent}%` }}
                        title={`Gyenge: ${stat.poorCount} (${poorPercent.toFixed(1)}%)`}
                      />
                    )}
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600">
                      {goodPercent.toFixed(1)}% jó
                    </span>
                    <span className="text-yellow-600">
                      {needsImprovementPercent.toFixed(1)}% fejleszthető
                    </span>
                    <span className="text-red-600">
                      {poorPercent.toFixed(1)}% gyenge
                    </span>
                  </div>
                </div>

                {/* Threshold reference */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Küszöbértékek: Jó ≤ {formatValue(metricInfo.thresholds.good, metricKey)},
                    Fejleszthető ≤ {formatValue(metricInfo.thresholds.poor, metricKey)},
                    Gyenge &gt; {formatValue(metricInfo.thresholds.poor, metricKey)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Top Paths */}
      {topPaths.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Legtöbb mérés oldalanként
          </h2>
          <div className="space-y-3">
            {topPaths.map((pathStat) => (
              <div
                key={pathStat.path}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{pathStat.path}</p>
                  <p className="text-sm text-gray-600">{pathStat.count} mérés</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600">
                    {pathStat.goodPercent.toFixed(0)}% jó
                  </span>
                  {pathStat.poorPercent > 0 && (
                    <span className="text-red-600">
                      {pathStat.poorPercent.toFixed(0)}% gyenge
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          A Core Web Vitals metrikákról
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            <strong>LCP (Largest Contentful Paint):</strong> A legnagyobb elem megjelenési
            ideje. Cél: &lt; 2.5s
          </li>
          <li>
            <strong>FID (First Input Delay):</strong> Az első kattintás válaszideje. Cél:
            &lt; 100ms
          </li>
          <li>
            <strong>CLS (Cumulative Layout Shift):</strong> Az oldal vizuális stabilitása.
            Cél: &lt; 0.1
          </li>
          <li>
            <strong>TTFB (Time to First Byte):</strong> A szerver első válaszának ideje.
            Cél: &lt; 800ms
          </li>
          <li>
            <strong>INP (Interaction to Next Paint):</strong> Az interakciók általános
            gyorsasága. Cél: &lt; 200ms
          </li>
        </ul>
      </div>
    </div>
  )
}
