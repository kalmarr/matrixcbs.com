'use client'

// MATRIX CBS - Client-side Providers
// SessionProvider for NextAuth
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
