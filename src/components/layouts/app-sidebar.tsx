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
import { Logo } from '@/components/ui/logo'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
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
  QuestionMarkCircleIcon,
  ShoppingCartIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
  TruckIcon,
  UserGroupIcon,
  WalletIcon,
} from '@heroicons/react/20/solid'
import { usePathname } from 'next/navigation'

function AccountDropdownMenu({ anchor }: { anchor: 'top start' | 'bottom end' }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="/settings">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="#">
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="#">
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/api/auth/signout">
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

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
        <Dropdown>
          <DropdownButton as={SidebarItem}>
            <Logo className="size-6" />
            <SidebarLabel className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
              RepBox
            </SidebarLabel>
            <ChevronDownIcon />
          </DropdownButton>
          <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
            <DropdownItem href="/settings">
              <Cog8ToothIcon />
              <DropdownLabel>Settings</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem href="#">
              <Avatar slot="icon" initials="RB" className="bg-blue-600 text-white" />
              <DropdownLabel>RepBox CRM</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem href="#">
              <PlusIcon />
              <DropdownLabel>New workspace&hellip;</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </SidebarHeader>

      <SidebarBody>
        <SidebarSection>
          <SidebarItem href="/dashboard" current={pathname === '/dashboard'}>
            <HomeIcon />
            <SidebarLabel>Home</SidebarLabel>
          </SidebarItem>
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
          <SidebarItem href="/manufacturers" current={pathname.startsWith('/manufacturers')}>
            <TruckIcon />
            <SidebarLabel>Manufacturers</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/products" current={pathname.startsWith('/products')}>
            <Square2StackIcon />
            <SidebarLabel>Products</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/commissions" current={pathname.startsWith('/commissions')}>
            <WalletIcon />
            <SidebarLabel>Commissions</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/settings" current={pathname.startsWith('/settings')}>
            <Cog6ToothIcon />
            <SidebarLabel>Settings</SidebarLabel>
          </SidebarItem>
        </SidebarSection>

        <SidebarSection className="max-lg:hidden">
          <SidebarHeading>Quick Links</SidebarHeading>
          <SidebarItem href="/line-cards">
            Line Cards
          </SidebarItem>
          <SidebarItem href="/territories">
            Territories
          </SidebarItem>
          <SidebarItem href="/activities">
            Activities
          </SidebarItem>
          <SidebarItem href="/reports">
            Reports
          </SidebarItem>
          <SidebarItem href="/import">
            Import Data
          </SidebarItem>
        </SidebarSection>

        <SidebarSpacer />

        <SidebarSection>
          <SidebarItem href="#">
            <QuestionMarkCircleIcon />
            <SidebarLabel>Support</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="#">
            <SparklesIcon />
            <SidebarLabel>Changelog</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>

      {user && (
        <SidebarFooter className="max-lg:hidden">
          <Dropdown>
            <DropdownButton 
              as={SidebarItem} 
              style={{ 
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2A2F36'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <span className="flex min-w-0 items-center gap-3">
                <Avatar src={user.image || undefined} className="size-10" square alt="" />
                <span className="min-w-0">
                  <span className="block truncate text-sm/5 font-medium text-white">
                    {user.name || 'User'}
                  </span>
                  <span className="block truncate text-xs/5 font-normal" style={{ color: '#5DA9FF' }}>
                    {user.email || ''}
                  </span>
                </span>
              </span>
              <ChevronUpIcon className="size-5" style={{ fill: '#5DA9FF' }} />
            </DropdownButton>
            <AccountDropdownMenu anchor="top start" />
          </Dropdown>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}

