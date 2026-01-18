// MATRIX CBS - NextAuth Configuration
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Jelszó', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email as string }
        })

        if (!admin || !admin.isActive) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          admin.passwordHash
        )

        if (!isValid) {
          return null
        }

        // Update last login
        await prisma.admin.update({
          where: { id: admin.id },
          data: { lastLogin: new Date() }
        })

        return {
          id: admin.id.toString(),
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // Use token data directly (NO Prisma - Edge Runtime compatible!)
        // Token data comes from jwt callback which runs during login (Node.js)
        session.user.id = token.id as string
        session.user.name = token.name as string
        ;(session.user as any).role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  trustHost: true
})
