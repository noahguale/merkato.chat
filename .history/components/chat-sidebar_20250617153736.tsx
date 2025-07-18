'use client'

import * as React from 'react'

import { Sidebar, SidebarRail } from '@/components/animate-ui/radix/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
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
/***
 * Sidebar Trigger
 * New Chat Button - Message Square Plus Icon
 * Search Input - Search Icon
 * Sidebar Content - Threads
 * Sidebar Footer - User Avatar, Name, Email, Plan, Logout Button
 */
