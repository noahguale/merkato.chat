'use client'

import { Search } from 'lucide-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
	SidebarHeader,
	SidebarInput,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from './animate-ui/radix/sidebar'
import { Button } from './ui/button'
import { Kbd, KbdKey } from './ui/kdb'

export const SideHeader = () => {
	const router = useRouter()

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				router.push('/chat')
			}
			if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				const searchInput = document.querySelector(
					'input[placeholder="Search your threads..."]'
				) as HTMLInputElement
				if (searchInput) {
					searchInput.focus()
				}
			}
		}

		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [router])

	return (
		<SidebarHeader className="p-4 space-y-4">
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
				className=" font-ibm-plex-mono p-5 "
				asChild
			>
				<a href="/chat">
					<span>New Chat</span>
					<Kbd className="h-5 max-w-max rounded-xs px-1.5 flex items-center gap-0.5 text-[.6875rem] font-bold  dark:text-gray-300 dark:border-offgray-400/10 border  dark:bg-cream-900/10   sm:flex !border-white/20 !bg-white/10 !text-white">
						<KbdKey aria-label="Meta">⌘</KbdKey>
						<KbdKey>N</KbdKey>
					</Kbd>
				</a>
			</Button>
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
				<SidebarInput
					placeholder="Search your threads..."
					className="pl-10 pr-16 bg-transparent"
				/>
				<div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
					<Kbd className="h-5 max-w-max rounded-xs px-1.5 flex items-center gap-0.5 text-[.6875rem] font-bold  dark:text-gray-300 dark:border-offgray-400/10 border  dark:bg-cream-900/10   sm:flex !border-white/20 !bg-white/10 !text-white">
						<KbdKey aria-label="Meta">⌘</KbdKey>
						<KbdKey>S</KbdKey>
					</Kbd>
				</div>
			</div>
		</SidebarHeader>
	)
}
