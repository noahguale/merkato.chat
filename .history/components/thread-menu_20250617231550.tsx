'use client'

import * as React from 'react'
import { useQuery, useConvexAuth } from 'convex/react'
import { useRouter } from 'next/navigation'
import { api } from '@/convex/_generated/api'
import { MessageSquare } from './animate-ui/icons/message-square'
import { formatDistanceToNow } from 'date-fns'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'

interface ThreadMenuProps {
	placeholder?: string
	triggerText?: string
	triggerClassName?: string
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export function ThreadMenu({
	placeholder = 'Search threads...',
	open,
	onOpenChange,
}: ThreadMenuProps) {
	const router = useRouter()
	const { isAuthenticated } = useConvexAuth()
	const threads = useQuery(api.chat.getThreads, isAuthenticated ? {} : 'skip')

	const handleThreadSelect = (threadId: string) => {
		router.push(`/chat/${threadId}`)
		onOpenChange?.(false)
	}

	return (
		<CommandDialog open={open} onOpenChange={onOpenChange}>
			<CommandInput placeholder={placeholder} />
			<CommandList>
				<CommandEmpty>No threads found.</CommandEmpty>
				<CommandGroup heading="Threads">
					{threads?.map((thread) => (
						<CommandItem
							key={thread.id}
							value={`${thread.title || 'New Chat'} ${formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}`}
							onSelect={() => handleThreadSelect(thread.id)}
						>
							<div className="rounded-md bg-sidebar-accent/20 p-1.5">
								<MessageSquare className="size-4 text-sidebar-foreground" />
							</div>
							<span>{thread.title || 'New Chat'}</span>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	)
}

export function GlobalThreadMenu() {
	const [open, setOpen] = React.useState(false)
	const router = useRouter()
	const threads = useQuery(api.chat.getThreads)

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				if (
					(e.target instanceof HTMLElement && e.target.isContentEditable) ||
					e.target instanceof HTMLInputElement ||
					e.target instanceof HTMLTextAreaElement ||
					e.target instanceof HTMLSelectElement
				) {
					return
				}
				e.preventDefault()
				setOpen((open) => !open)
			}
		}
		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [])

	const handleThreadSelect = (threadId: string) => {
		router.push(`/chat/${threadId}`)
		setOpen(false)
	}

	return (
		<div>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Search threads..." />
				<CommandList>
					<CommandEmpty>No threads found.</CommandEmpty>
					<CommandGroup heading="Threads">
						{threads?.map((thread) => (
							<CommandItem
								key={thread.id}
								value={`${thread.title || 'New Chat'} ${formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}`}
								onSelect={() => handleThreadSelect(thread.id)}
							>
								<div className="rounded-md bg-sidebar-accent/20 p-1.5">
									<MessageSquare className="size-4 text-sidebar-foreground" />
								</div>
								<span>{thread.title || 'New Chat'}</span>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</div>
	)
}
