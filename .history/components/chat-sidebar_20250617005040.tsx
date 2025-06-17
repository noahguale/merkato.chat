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
	Plus,
	Sparkles,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useIsMobile } from '@/hooks/use-mobile'
import { SignOut } from './sign-out'
import { KbdKey } from './ui/kdb'
import { Kbd } from './ui/kdb'
import { Button } from './ui/button'

const APP_DATA = {
	name: 'Merkato Chat',
	logo: Bot,
	plan: 'Free',
}

const USER_DATA = {
	name: 'User',
	email: 'user@example.com',
	avatar: '',
}

export function ChatSidebar() {
	const isMobile = useIsMobile()
	const threads = useQuery(api.chat.getThreads)

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				{/* App Header */}
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								<APP_DATA.logo className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="font-lora truncate font-semibold">
									{APP_DATA.name}
								</span>
								<span className="truncate text-xs">{APP_DATA.plan}</span>
							</div>
						</SidebarMenuButton>
						<SidebarTrigger className="-ml-1" />
					</SidebarMenuItem>
				</SidebarMenu>
				{/* New Chat Button */}
				<SidebarMenu>
					<div className="font-ibm-plex-mono group select-none text-sm tracking-tight rounded-sm flex gap-1.5 items-center justify-center text-nowrap border transition-colors duration-75 cursor-pointer bg-blue-600 border-transparent text-white [box-shadow:hsl(219,_93%,_30%)_0_-2px_0_0_inset,_hsl(219,_93%,_95%)_0_1px_3px_0] hover:bg-[hsl(219,_93%,_35%)] active:[box-shadow:none] hover:[box-shadow:none] h-9 pl-2.5 pr-3 w-full sm:w-fit">
						<Button size={'sm'} className="w-full justify-start" asChild>
							<a href="/chat">
								<span>New Chat</span>
								<Kbd
									className="h-5 max-w-max rounded-xs px-1.5 flex items-center gap-0.5 text-[.6875rem] font-bold text-gray-500 dark:text-gray-300 dark:border-offgray-400/10 border  dark:bg-cream-900/10   sm:flex !border-white/20 !bg-white/10 !text-white"
									separator={
										<span className="text-white">
											<Plus size={8} />
										</span>
									}
								>
									<KbdKey aria-label="Meta">⌘</KbdKey>
									<KbdKey>N</KbdKey>
								</Kbd>
							</a>
						</Button>
					</div>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				{/* Chat Threads */}
				<SidebarGroup>
					<SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
					<SidebarMenu>
						{threads?.length === 0 ? (
							<SidebarMenuItem>
								<div className="px-3 py-2 text-sm text-muted-foreground">
									No chats yet. Start a new conversation!
								</div>
							</SidebarMenuItem>
						) : (
							threads?.map((thread) => (
								<SidebarMenuItem key={thread.id}>
									<SidebarMenuButton asChild>
										<a href={`/chat/${thread.id}`}>
											<MessageSquare className="size-4" />
											<span className="truncate">
												{thread.title || 'New Chat'}
											</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))
						)}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				{/* Nav User */}
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage src={USER_DATA.avatar} alt={USER_DATA.name} />
										<AvatarFallback className="rounded-lg">U</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											{USER_DATA.name}
										</span>
										<span className="truncate text-xs">{USER_DATA.email}</span>
									</div>
									<ChevronsUpDown className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
								side={isMobile ? 'bottom' : 'right'}
								align="end"
								sideOffset={4}
							>
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<Avatar className="h-8 w-8 rounded-lg">
											<AvatarImage
												src={USER_DATA.avatar}
												alt={USER_DATA.name}
											/>
											<AvatarFallback className="rounded-lg">U</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-semibold">
												{USER_DATA.name}
											</span>
											<span className="truncate text-xs">
												{USER_DATA.email}
											</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem>
										<Sparkles />
										Upgrade to Pro
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem>
										<BadgeCheck />
										Account
									</DropdownMenuItem>
									<DropdownMenuItem>
										<CreditCard />
										Billing
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Bell />
										Notifications
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<SignOut />
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
				{/* Nav User */}
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
