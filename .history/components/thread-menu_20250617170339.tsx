'use client'

import React from 'react'
import { useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import { api } from '@/convex/_generated/api'
import { SimpleCommandMenu } from './command-menu'
import { MessageSquare } from './animate-ui/icons/message-square'
import { Pin } from './animate-ui/icons/pin'
import { formatDistanceToNow } from 'date-fns'

interface ThreadMenuProps {
	placeholder?: string
	triggerText?: string
	triggerClassName?: string
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export function ThreadMenu({
	placeholder = 'Search threads...',
	triggerText = 'Search threads...',
	triggerClassName,
	open,
	onOpenChange,
}: ThreadMenuProps) {
	const router = useRouter()
	const threads = useQuery(api.chat.getThreads)

	// Convert threads to command menu items
	const threadItems = React.useMemo(() => {
		if (!threads) return []

		return threads.map((thread) => ({
			id: thread.id,
			label: thread.title || 'New Chat',
			icon: (
				<div className="flex items-center gap-2">
					<div className="rounded-md bg-sidebar-accent/20 p-1">
						<MessageSquare className="size-3 text-sidebar-foreground" />
					</div>
					{thread.pinned && (
						<Pin className="size-3 text-primary fill-current" />
					)}
				</div>
			),
			action: () => {
				router.push(`/chat/${thread.id}`)
			},
			keywords: [
				thread.title || 'New Chat',
				thread.pinned ? 'pinned' : 'unpinned',
				formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true }),
			],
			// Store the thread data for rendering
			threadData: thread,
		}))
	}, [threads, router])

	return (
		<SimpleCommandMenu
			placeholder={placeholder}
			triggerText={triggerText}
			triggerClassName={triggerClassName}
			items={threadItems}
			open={open}
			onOpenChange={onOpenChange}
			onItemSelect={(item) => {
				// Navigation is handled by the item's action
				console.log('Selected thread:')
			}}
		/>
	)
}

// Enhanced version with grouped threads
export function ThreadMenuEnhanced({
	placeholder = 'Search threads...',
	triggerText = 'Search threads...',
	triggerClassName,
	open,
	onOpenChange,
}: ThreadMenuProps) {
	const router = useRouter()
	const threads = useQuery(api.chat.getThreads)
	const pinnedThreads = useQuery(api.chat.getPinnedThreads)

	// Group threads by category
	const threadGroups = React.useMemo(() => {
		if (!threads) return { pinned: [], recent: [], older: [] }

		const now = new Date()
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

		const unpinnedThreads = threads.filter((t) => !t.pinned)

		return {
			pinned: pinnedThreads || [],
			recent: unpinnedThreads.filter((t) => new Date(t.createdAt) >= weekAgo),
			older: unpinnedThreads.filter((t) => new Date(t.createdAt) < weekAgo),
		}
	}, [threads, pinnedThreads])

	// Convert to command menu items with visual indicators
	const allItems = React.useMemo(() => {
		const items: any[] = []

		// Add pinned threads
		threadGroups.pinned.forEach((thread) => {
			items.push({
				id: `pinned-${thread.id}`,
				label: thread.title || 'New Chat',
				icon: (
					<div className="flex items-center gap-2">
						<div className="rounded-md bg-primary/20 p-1">
							<MessageSquare className="size-3 text-primary" />
						</div>
						<Pin className="size-3 text-primary fill-current" />
					</div>
				),
				action: () => router.push(`/chat/${thread.id}`),
				keywords: [
					thread.title || 'New Chat',
					'pinned',
					formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true }),
				],
				group: 'Pinned',
				threadData: thread,
			})
		})

		// Add recent threads
		threadGroups.recent.forEach((thread) => {
			items.push({
				id: `recent-${thread.id}`,
				label: thread.title || 'New Chat',
				icon: (
					<div className="rounded-md bg-sidebar-accent/20 p-1.5">
						<MessageSquare className="size-4 text-sidebar-foreground" />
					</div>
				),
				action: () => router.push(`/chat/${thread.id}`),
				keywords: [
					thread.title || 'New Chat',
					'recent',
					formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true }),
				],
				group: 'Recent',
				threadData: thread,
			})
		})

		// Add older threads
		threadGroups.older.forEach((thread) => {
			items.push({
				id: `older-${thread.id}`,
				label: thread.title || 'New Chat',
				icon: (
					<div className="rounded-md bg-muted/20 p-1.5">
						<MessageSquare className="size-4 text-muted-foreground" />
					</div>
				),
				action: () => router.push(`/chat/${thread.id}`),
				keywords: [
					thread.title || 'New Chat',
					'older',
					formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true }),
				],
				group: 'Older',
				threadData: thread,
			})
		})

		return items
	}, [threadGroups, router])

	if (!threads) {
		return (
			<SimpleCommandMenu
				placeholder={placeholder}
				triggerText={triggerText}
				triggerClassName={triggerClassName}
				items={[]}
				open={open}
				onOpenChange={onOpenChange}
			/>
		)
	}

	return (
		<SimpleCommandMenu
			placeholder={placeholder}
			triggerText={triggerText}
			triggerClassName={triggerClassName}
			items={allItems}
			open={open}
			onOpenChange={onOpenChange}
			onItemSelect={(item) => {}}
		/>
	)
}

// Hook for controlling thread menu
export function useThreadMenu() {
	const [open, setOpen] = React.useState(false)

	const openThreadMenu = React.useCallback(() => {
		setOpen(true)
	}, [])

	const closeThreadMenu = React.useCallback(() => {
		setOpen(false)
	}, [])

	const toggleThreadMenu = React.useCallback(() => {
		setOpen((prev) => !prev)
	}, [])

	return {
		open,
		setOpen,
		openThreadMenu,
		closeThreadMenu,
		toggleThreadMenu,
	}
}
