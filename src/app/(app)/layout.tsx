import { AppHeader } from '@/components/layouts/app-header'
import { AppSidebar } from '@/components/layouts/app-sidebar'
import { SidebarLayout } from '@/components/ui/sidebar-layout'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login')
  }

  return (
    <SidebarLayout
      navbar={<AppHeader user={session.user} />}
      sidebar={<AppSidebar user={session.user} />}
    >
      {children}
    </SidebarLayout>
  )
}
