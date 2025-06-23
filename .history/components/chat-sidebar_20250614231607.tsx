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
	ChevronRightIcon,
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

export const Banner = () => {
	return (
		<div className="relative w-full px-2 py-2 md:px-16 group flex items-center border-b border-blue-200/80 dark:border-blue-300/10 border-dashed hover:border-solid bg-linear-to-r from-transparent via-blue-100/40 to-transparent hover:bg-blue-50 dark:from-transparent dark:via-blue-600/10 dark:to-transparent dark:hover:bg-blue-700/10 fv-style transition-colors">
			<div className="relative mx-auto flex max-w-sm items-center gap-4 ">
				<div className="flex items-center gap-1">
					<Sparkles className="icons-base" size={24} />
					<span className="text-accent-blue text-sm dark:text-blue-100">
						Introducing:{' '}
						<span className="font-lora font-semibold tracking-wide">
							Agentic Editing
						</span>{' '}
						→
					</span>
				</div>
			</div>

			{/* Noise background */}
			{/* <div
				style={{
					backgroundImage: 'url(/_next/static/media/noise.0e24d0e5.png)',
				}}
				className="pointer-events-none [z-index:-1] absolute inset-0 bg-[size:180px] bg-repeat opacity-[0.035] dark:opacity-[0.015]"
			/> */}

			{/* Corner decorations */}
			<div className="absolute z-10 size-2 rotate-45 rounded-[1px] border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black bottom-[-4.5px] left-0" />
			<div className="absolute z-10 size-2 rotate-45 rounded-[1px] border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black bottom-[-4.5px] right-0" />
		</div>
	)
}

export const StyledSection = ({ children }: { children: React.ReactNode }) => {
	return (
		<section
			className="relative min-h-screen px-4 pt-20 pb-[12rem] sm:px-6 sm:pt-28 md:pb-[10.9rem] bg-linear-to-t from-blue-100/20 dark:from-blue-900/5"
			style={{ opacity: 1, filter: 'blur(0px)' }}
		>
			{/* Corner decorations */}
			<div className="absolute z-10 size-2 rotate-45 rounded-[1px] border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black bottom-[-4.5px] left-0" />
			<div className="absolute z-10 size-2 rotate-45 rounded-[1px] border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black bottom-[-4.5px] right-0" />

			{/* Grid pattern background */}
			<svg
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 [z-index:-1] size-full fill-blue-500/50 stroke-blue-500/50 [mask-image:linear-gradient(to_top,_#ffffffad,_transparent)] opacity-[.30]"
				style={{ visibility: 'visible' }}
			>
				<defs>
					<pattern
						id=":R1oafknq6ja:"
						width="20"
						height="20"
						patternUnits="userSpaceOnUse"
						x="-1"
						y="-1"
					>
						<path d="M.5 20V.5H20" fill="none" strokeDasharray="0" />
					</pattern>
				</defs>
				<rect
					width="100%"
					height="100%"
					strokeWidth="0"
					fill="url(#:R1oafknq6ja:)"
				/>
			</svg>

			{children}
		</section>
	)
}

export default StyledSection
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
								<span className="truncate font-semibold">{APP_DATA.name}</span>
								<span className="truncate text-xs">{APP_DATA.plan}</span>
							</div>
						</SidebarMenuButton>
						<SidebarTrigger className="-ml-1" />
					</SidebarMenuItem>
				</SidebarMenu>
				{/* New Chat Button */}
				<SidebarMenu>
					<SidebarMenuItem className="group select-none text-sm tracking-tight rounded-sm flex gap-1.5 items-center justify-center text-nowrap border transition-colors duration-75 cursor-pointer bg-blue-600 border-transparent text-white [box-shadow:hsl(219,_93%,_30%)_0_-2px_0_0_inset,_hsl(219,_93%,_95%)_0_1px_3px_0] hover:bg-[hsl(219,_93%,_35%)] active:[box-shadow:none] hover:[box-shadow:none] h-9 pl-2.5 pr-3 w-full sm:w-fit">
						<SidebarMenuButton size={'sm'} className="w-full justify-start">
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
						</SidebarMenuButton>
					</SidebarMenuItem>
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
