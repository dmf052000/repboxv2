import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tenantSubdomain, tenantName, name, email, password } = body

    // Validate input
    if (!tenantSubdomain || !tenantName || !name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if tenant already exists
    const existingTenant = await db.tenant.findUnique({
      where: { subdomain: tenantSubdomain },
    })

    if (existingTenant) {
      return NextResponse.json(
        { error: 'Tenant subdomain already exists' },
        { status: 400 }
      )
    }

    // Create tenant
    const tenant = await db.tenant.create({
      data: {
        subdomain: tenantSubdomain,
        name: tenantName,
      },
    })

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    await db.user.create({
      data: {
        tenantId: tenant.id,
        email,
        name,
        passwordHash,
        role: 'ADMIN',
      },
    })

    return NextResponse.json({ success: true, tenantId: tenant.id })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    )
  }
}

