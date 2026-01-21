// MATRIX CBS - Prisma Client Singleton
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prismaclient-in-serverless-environments

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Named export (a legtöbb fájl így importálja)
export { prisma }

// Default export (visszafele kompatibilitás)
export default prisma
