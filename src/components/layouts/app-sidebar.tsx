'use client'

import { Avatar } from '@/components/ui/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/ui/dropdown'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/ui/sidebar'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid'
import {
  ArrowUpTrayIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  IdentificationIcon,
  InboxIcon,
  ShoppingCartIcon,
  TicketIcon,
  TruckIcon,
  UserGroupIcon,
  WalletIcon,
} from '@heroicons/react/20/solid'
import { usePathname } from 'next/navigation'

interface AppSidebarProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarItem href="/dashboard">
          <SidebarLabel className="text-lg font-semibold">RepBox</SidebarLabel>
        </SidebarItem>
      </SidebarHeader>

      <SidebarBody>
        <SidebarSection>
          <SidebarItem href="/dashboard" current={pathname === '/dashboard'}>
            <HomeIcon />
            <SidebarLabel>Dashboard</SidebarLabel>
          </SidebarItem>
        </SidebarSection>

        <SidebarSection>
          <SidebarHeading>CRM</SidebarHeading>
          <SidebarItem href="/contacts" current={pathname.startsWith('/contacts')}>
            <UserGroupIcon />
            <SidebarLabel>Contacts</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/companies" current={pathname.startsWith('/companies')}>
            <BuildingOffice2Icon />
            <SidebarLabel>Companies</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/opportunities" current={pathname.startsWith('/opportunities')}>
            <TicketIcon />
            <SidebarLabel>Opportunities</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/quotes" current={pathname.startsWith('/quotes')}>
            <ShoppingCartIcon />
            <SidebarLabel>Quotes</SidebarLabel>
          </SidebarItem>
        </SidebarSection>

        <SidebarSection>
          <SidebarHeading>Products</SidebarHeading>
          <SidebarItem href="/manufacturers" current={pathname.startsWith('/manufacturers')}>
            <TruckIcon />
            <SidebarLabel>Manufacturers</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/products" current={pathname.startsWith('/products')}>
            <IdentificationIcon />
            <SidebarLabel>Products</SidebarLabel>
          </SidebarItem>
        </SidebarSection>

        <SidebarSection>
          <SidebarHeading>Rep Management</SidebarHeading>
          <SidebarItem href="/line-cards" current={pathname.startsWith('/line-cards')}>
            <InboxIcon />
            <SidebarLabel>Line Cards</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/territories" current={pathname.startsWith('/territories')}>
            <ChartBarIcon />
            <SidebarLabel>Territories</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/commissions" current={pathname.startsWith('/commissions')}>
            <WalletIcon />
            <SidebarLabel>Commissions</SidebarLabel>
          </SidebarItem>
        </SidebarSection>

        <SidebarSection>
          <SidebarItem href="/activities" current={pathname.startsWith('/activities')}>
            <InboxIcon />
            <SidebarLabel>Activities</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/import" current={pathname.startsWith('/import')}>
            <ArrowUpTrayIcon />
            <SidebarLabel>Import</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/reports" current={pathname.startsWith('/reports')}>
            <ChartBarIcon />
            <SidebarLabel>Reports</SidebarLabel>
          </SidebarItem>
        </SidebarSection>

        <SidebarSpacer />

        <SidebarSection>
          <SidebarItem href="/settings" current={pathname.startsWith('/settings')}>
            <Cog6ToothIcon />
            <SidebarLabel>Settings</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>

      {user && (
        <SidebarFooter className="max-lg:hidden">
          <Dropdown>
            <DropdownButton as={SidebarItem}>
              <span className="flex min-w-0 items-center gap-3">
                <Avatar src={user.image || undefined} className="size-10" square alt={user.name || ''} />
                <span className="min-w-0">
                  <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                    {user.name || 'User'}
                  </span>
                  <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                    {user.email || ''}
                  </span>
                </span>
              </span>
              <ChevronUpIcon />
            </DropdownButton>
            <DropdownMenu className="min-w-64" anchor="top start">
              <DropdownItem href="/settings/profile">
                <UserCircleIcon />
                <DropdownLabel>My account</DropdownLabel>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem href="/api/auth/signout">
                <ArrowRightStartOnRectangleIcon />
                <DropdownLabel>Sign out</DropdownLabel>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}

