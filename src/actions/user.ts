'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export async function updateUser(userId: string, data: { name: string }) {
  const session = await auth()

  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error('Unauthorized')
  }

  const user = await db.user.update({
    where: { id: userId },
    data: {
      name: data.name,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  })

  revalidatePath('/settings')
  return user
}

export async function updatePassword(
  userId: string,
  data: { currentPassword: string; newPassword: string }
) {
  const session = await auth()

  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error('Unauthorized')
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      passwordHash: true,
    },
  })

  if (!user || !user.passwordHash) {
    throw new Error('User not found')
  }

  // Verify current password
  const passwordMatch = await bcrypt.compare(
    data.currentPassword,
    user.passwordHash
  )

  if (!passwordMatch) {
    throw new Error('Current password is incorrect')
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(data.newPassword, 10)

  // Update password
  await db.user.update({
    where: { id: userId },
    data: {
      passwordHash: newPasswordHash,
    },
  })

  revalidatePath('/settings')
  return { success: true }
}


