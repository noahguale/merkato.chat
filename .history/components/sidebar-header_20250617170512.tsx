'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
	SidebarHeader,
	SidebarInput,
	SidebarTrigger,
	useSidebar,
} from './animate-ui/radix/sidebar'
import { Button } from './ui/button'
import { Kbd, KbdKey } from './ui/kdb'
import { MessageSquarePlus } from './animate-ui/icons/message-square-plus'
import { Search } from './animate-ui/icons/search'

export const SideHeader = () => {
	const router = useRouter()
	const { state } = useSidebar()

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 't' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				router.push('/chat')
			}
			// if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			// 	e.preventDefault()
			// 	const searchInput = document.querySelector(
			// 		'input[placeholder="Search your threads..."]'
			// 	) as HTMLInputElement
			// 	if (searchInput) {
			// 		searchInput.focus()
			// 	}
			// }
		}

		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [router])

	return (
		<SidebarHeader className="p-4 space-y-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:space-y-2">
			{/* Collapsed state - icon layout */}
			<div className="hidden group-data-[collapsible=icon]:flex flex-col items-center gap-2">
				<SidebarTrigger className="size-10" />
				<div className="flex flex-col items-center gap-4 mt-10">
					<Button variant="blue" size="icon" className="size-8" asChild>
						<a href="/chat">
							<MessageSquarePlus className="size-5" animateOnHover />
							<span className="sr-only">New Chat</span>
						</a>
					</Button>
					<Button
						variant="glass"
						size="icon"
						className="size-8"
						onClick={() => {
							const searchInput = document.querySelector(
								'input[placeholder="Search your threads..."]'
							) as HTMLInputElement
							if (searchInput) {
								searchInput.focus()
							}
						}}
					>
						<Search className="size-5" animateOnHover />
						<span className="sr-only">Search</span>
					</Button>
				</div>{' '}
			</div>

			{/* Expanded state - full layout */}
			<div className="space-y-4 group-data-[collapsible=icon]:hidden">
				<div className="flex items-center gap-3">
					<SidebarTrigger className="" />
					<a href="/chat" className="text-xl font-semibold font-ibm-plex-mono">
						<span>merkato</span>
						<span className="text-primary">.chat</span>
					</a>
				</div>
				<Button
					variant={'blue'}
					size={'base'}
					className=" font-ibm-plex-mono p-5 w-full"
					asChild
				>
					<a href="/chat">
						<span>New Chat</span>
						<Kbd className="h-5 max-w-max rounded-xs px-1.5 flex items-center gap-0.5 text-[.6875rem] font-bold  dark:text-gray-300 dark:border-offgray-400/10 border  dark:bg-cream-900/10   sm:flex !border-white/20 !bg-white/10 !text-white">
							<KbdKey aria-label="Meta">⌘</KbdKey>
							<KbdKey>T</KbdKey>
						</Kbd>
					</a>
				</Button>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
					<SidebarInput
						placeholder="Search your threads..."
						className="pl-10 pr-16 bg-transparent placeholder:text-xs"
					/>
					<div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
						<Kbd className="h-5 max-w-max rounded-xs px-1.5 flex items-center gap-0.5 text-[.6875rem] font-bold  dark:text-gray-300 dark:border-offgray-400/10 border  dark:bg-cream-900/10   sm:flex !border-white/20 !bg-white/10 !text-white">
							<KbdKey aria-label="Meta">⌘</KbdKey>
							<KbdKey>K</KbdKey>
						</Kbd>
					</div>
				</div>
			</div>
		</SidebarHeader>
	)
}
