import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from './db'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  // No adapter needed for CredentialsProvider - sessions are JWT-based
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        tenantId: { label: 'Tenant', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.tenantId) {
          return null
        }

        // First, resolve tenant by subdomain (for local dev) or by ID
        const tenantSubdomainOrId = credentials.tenantId as string
        
        // Try to find tenant by subdomain first (for local development)
        let tenant = await db.tenant.findUnique({
          where: { subdomain: tenantSubdomainOrId },
        })

        // If not found by subdomain, try by ID (for production)
        if (!tenant) {
          tenant = await db.tenant.findUnique({
            where: { id: tenantSubdomainOrId },
          })
        }

        if (!tenant) {
          return null
        }

        // Now find user with the resolved tenantId
        const user = await db.user.findUnique({
          where: {
            tenantId_email: {
              tenantId: tenant.id,
              email: credentials.email as string,
            },
          },
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          tenantId: user.tenantId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenantId = (user as any).tenantId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        ;(session.user as any).tenantId = token.tenantId as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})

