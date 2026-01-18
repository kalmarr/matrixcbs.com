'use client'

// MATRIX CBS - Before Unload Hook
// Figyelmeztetés oldal elhagyásakor, ha vannak nem mentett változások

import { useEffect } from 'react'

export function useBeforeUnload(enabled: boolean, message?: string) {
  useEffect(() => {
    if (!enabled) return

    const defaultMessage =
      'Biztosan el akarod hagyni az oldalt? A nem mentett változások elvesznek.'

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      // Modern böngészők nem engedélyezik egyedi üzenet megjelenítését
      // csak a böngésző saját figyelmeztetése jelenik meg
      e.returnValue = message || defaultMessage
      return message || defaultMessage
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [enabled, message])
}
