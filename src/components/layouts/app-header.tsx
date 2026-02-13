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
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/ui/navbar'
import {
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid'

interface AppHeaderProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

function AccountDropdownMenu({ anchor }: { anchor: 'top start' | 'bottom end' }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="/settings">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/api/auth/signout">
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export function AppHeader({ user }: AppHeaderProps) {
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  return (
    <Navbar className="bg-white border-b border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
      <NavbarSpacer />
      <NavbarSection>
        {user && (
          <Dropdown>
            <DropdownButton as={NavbarItem}>
              <Avatar
                src={user.image || undefined}
                initials={!user.image ? initials : undefined}
                square
                alt={user.name || ''}
                className="size-8"
              />
            </DropdownButton>
            <AccountDropdownMenu anchor="bottom end" />
          </Dropdown>
        )}
      </NavbarSection>
    </Navbar>
  )
}





