import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Heading, Subheading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Divider } from '@/components/ui/divider'
import { ProfileForm } from '@/components/forms/profile-form'
import { PasswordForm } from '@/components/forms/password-form'
import { Avatar } from '@/components/ui/avatar'

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Get full user data from database
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <>
      <Heading>My Account</Heading>
      <Text className="mt-2">
        Manage your account settings and preferences.
      </Text>

      <Divider className="my-10 mt-6" />

      {/* Profile Section */}
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Profile</Subheading>
          <Text>Update your personal information and profile details.</Text>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar
              src={null}
              alt={user.name || user.email || 'User'}
              className="size-16"
            />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                Profile Picture
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Avatar images are not yet supported
              </p>
            </div>
          </div>
          <ProfileForm user={user} />
        </div>
      </section>

      <Divider className="my-10" soft />

      {/* Security Section */}
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Security</Subheading>
          <Text>Change your password to keep your account secure.</Text>
        </div>
        <div>
          <PasswordForm userId={user.id} />
        </div>
      </section>

      <Divider className="my-10" soft />

      {/* Account Information */}
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <div className="space-y-1">
          <Subheading>Account Information</Subheading>
          <Text>View your account details and membership information.</Text>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white">
              Email Address
            </label>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {user.email}
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Your email address cannot be changed.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white">
              Role
            </label>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 capitalize">
              {user.role.toLowerCase()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-white">
              Member Since
            </label>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}


