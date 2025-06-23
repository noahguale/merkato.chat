'use client'

import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import {
	SidebarHeader,
	SidebarInput,
	SidebarTrigger,
} from './animate-ui/radix/sidebar'
import { Button } from './ui/button'
import { Kbd, KbdKey } from './ui/kdb'
import { MessageSquarePlus } from './animate-ui/icons/message-square-plus'
import { Search } from './animate-ui/icons/search'
import { useThreadSearch } from '@/contexts/thread-search-context'
import { Link } from 'react-router'

export const SideHeader = () => {
	const navigate = useNavigate()
	const { searchQuery, setSearchQuery } = useThreadSearch()
	const searchInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				navigate('/chat')
			}
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				searchInputRef.current?.focus()
			}
		}

		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [navigate])

	return (
		<SidebarHeader className="p-4 space-y-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:space-y-2">
			{/* Collapsed state - icon layout */}
			<div className="hidden group-data-[collapsible=icon]:flex flex-col items-center gap-2">
				<SidebarTrigger className="size-10" />
				<div className="flex flex-col items-center gap-4 mt-10">
					<Button variant="blue" size="icon" className="size-8" asChild>
						<Link to="/chat">
							<MessageSquarePlus className="size-5" animateOnHover />
							<span className="sr-only">New Chat</span>
						</Link>
					</Button>
					<Button
						variant="glass"
						size="icon"
						className="size-8"
						onClick={() => searchInputRef.current?.focus()}
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
					<Link to="/chat" className="text-xl font-semibold font-ibm-plex-mono">
						<span>merkato</span>
						<span className="text-primary">.chat</span>
					</Link>
				</div>
				<Button
					variant={'blue'}
					size={'base'}
					className=" font-ibm-plex-mono p-5 w-full"
					asChild
				>
					<Link to="/chat">
						<span>New Chat</span>
						<Kbd className="h-5 max-w-max rounded-xs px-1.5 flex items-center gap-0.5 text-[.6875rem] font-bold  dark:text-gray-300 dark:border-offgray-400/10 border  dark:bg-cream-900/10   sm:flex !border-white/20 !bg-white/10 !text-white">
							<KbdKey aria-label="Meta">⌘</KbdKey>
							<KbdKey>L</KbdKey>
						</Kbd>
					</Link>
				</Button>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
					<SidebarInput
						ref={searchInputRef}
						placeholder="Search your threads..."
						className="pl-10 pr-16 bg-transparent placeholder:text-xs"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
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
