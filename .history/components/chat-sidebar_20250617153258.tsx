'use client'

import * as React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

import {
	Sidebar,
	SidebarHeader,
	SidebarContent,
	SidebarFooter,
	SidebarRail,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarTrigger,
} from '@/components/animate-ui/radix/sidebar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/animate-ui/radix/dropdown-menu'
import {
	BadgeCheck,
	Bell,
	Bot,
	ChevronsUpDown,
	CreditCard,
	MessageSquare,
	Sparkles,
	Pin,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useIsMobile } from '@/hooks/use-mobile'
import { SignOut } from './sign-out'
import { KbdKey } from './ui/kdb'
import { Kbd } from './ui/kdb'
import { Button } from './ui/button'
import { ThreadPinButton } from './thread-pin-button'
import { SideHeader } from './sidebar-header'
import { SideContent } from './sidebar-content'
import { SideFooter } from './sidebar-footer'

export function ChatSidebar() {
	const isMobile = useIsMobile()

	return (
		<Sidebar collapsible="icon">
			<SideHeader />

			<SideContent />

			<SideFooter isMobile={isMobile} />
			<SidebarRail />
		</Sidebar>
	)
}
