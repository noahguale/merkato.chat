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
	const pinnedThreads = useQuery(api.chat.getPinnedThreads)

	return (
		<Sidebar collapsible="icon">
			{/* <SidebarHeader className="flex w-full items-center justify-center">
				<SidebarMenu>
					<SidebarMenuItem className="flex w-full items-center">
						<SidebarTrigger className="-ml-1" />

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
					</SidebarMenuItem>
				</SidebarMenu>
				<Button
					variant={'blue'}
					size={'base'}
					className="font-ibm-plex-mono p-5"
					asChild
				>
					<a href="/chat">
						<span>New Chat</span>
						<Kbd className="h-5 max-w-max rounded-xs px-1.5 flex items-center gap-0.5 text-[.6875rem] font-bold text-gray-500 dark:text-gray-300 dark:border-offgray-400/10 border  dark:bg-cream-900/10   sm:flex !border-white/20 !bg-white/10 !text-white">
							<KbdKey aria-label="Meta">⌘</KbdKey>
							<KbdKey>N</KbdKey>
						</Kbd>
					</a>
				</Button>
			</SidebarHeader> */}
			<SideHeader />

			<SidebarContent>
				{/* Pinned Threads */}
				{pinnedThreads && pinnedThreads.length > 0 && (
					<SidebarGroup>
						<SidebarGroupLabel className="flex items-center gap-2">
							<Pin className="size-4" />
							Pinned
						</SidebarGroupLabel>
						<SidebarMenu>
							{pinnedThreads.map((thread) => (
								<SidebarMenuItem key={thread.id}>
									<div className="group flex items-center w-full">
										<SidebarMenuButton asChild className="flex-1">
											<a
												href={`/chat/${thread.id}`}
												className="flex items-center"
											>
												<MessageSquare className="size-4" />
												<span className="truncate">
													{thread.title || 'New Chat'}
												</span>
											</a>
										</SidebarMenuButton>
										<div className="opacity-0 group-hover:opacity-100 transition-opacity">
											<ThreadPinButton
												threadId={thread.id}
												isPinned={thread.pinned}
												size="sm"
												className="ml-1"
											/>
										</div>
									</div>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroup>
				)}

				{/* Recent Chat Threads */}
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
							threads
								?.filter((thread) => !thread.pinned) // Filter out pinned threads from recent
								?.map((thread) => (
									<SidebarMenuItem key={thread.id}>
										<div className="group flex items-center w-full">
											<SidebarMenuButton asChild className="flex-1">
												<a
													href={`/chat/${thread.id}`}
													className="flex items-center"
												>
													<MessageSquare className="size-4" />
													<span className="truncate">
														{thread.title || 'New Chat'}
													</span>
												</a>
											</SidebarMenuButton>
											<div className="opacity-0 group-hover:opacity-100 transition-opacity">
												<ThreadPinButton
													threadId={thread.id}
													isPinned={thread.pinned}
													size="sm"
													className="ml-1"
												/>
											</div>
										</div>
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
