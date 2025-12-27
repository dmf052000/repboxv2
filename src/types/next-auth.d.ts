import 'next-auth'

declare module 'next-auth' {
  interface User {
    tenantId?: string
  }

  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      tenantId?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    tenantId?: string
  }
}





