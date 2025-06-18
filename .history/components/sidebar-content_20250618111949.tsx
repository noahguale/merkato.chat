'use client'

import { motion, LayoutGroup, AnimatePresence } from 'motion/react'
import { useMutation, useQuery, useConvexAuth } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { SidebarContent } from './animate-ui/radix/sidebar'
import { cn } from '@/lib/utils'
import { useState, useMemo } from 'react'
import { Pin } from './animate-ui/icons/pin'
import { PinOff } from './animate-ui/icons/pin-off'
import { MessageSquare } from './animate-ui/icons/message-square'
import { Trash } from './animate-ui/icons/trash'
import { useThreadSearch } from '@/contexts/thread-search-context'

export const SideContent = () => {
	const { searchQuery } = useThreadSearch()
	const { isAuthenticated } = useConvexAuth()
	const threads = useQuery(api.chat.getThreads, isAuthenticated ? {} : 'skip')
	const pinnedThreads = useQuery(
		api.chat.getPinnedThreads,
		isAuthenticated ? {} : 'skip'
	)
	const togglePin = useMutation(api.chat.toggleThreadPin)
	const deleteThread = useMutation(api.chat.deleteThread)

	const [togglingGroup, setTogglingGroup] = useState<
		'pinned' | 'unpinned' | null
	>(null)

	// Filter threads based on search query
	const filteredThreads = useMemo(() => {
		if (!threads || !searchQuery.trim()) return threads || []

		return threads.filter((thread) =>
			(thread.title || 'New Chat')
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
		)
	}, [threads, searchQuery])

	const filteredPinnedThreads = useMemo(() => {
		if (!pinnedThreads || !searchQuery.trim()) return pinnedThreads || []

		return pinnedThreads.filter((thread) =>
			(thread.title || 'New Chat')
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
		)
	}, [pinnedThreads, searchQuery])

	const handleTogglePin = async (
		threadId: Id<'threads'>,
		isPinned: boolean
	) => {
		try {
			setTogglingGroup(isPinned ? 'pinned' : 'unpinned')
			await togglePin({ threadId })
			// Reset group z-index after animation
			setTimeout(() => setTogglingGroup(null), 500)
		} catch (error) {
			console.error('Failed to toggle pin:', error)
			setTogglingGroup(null)
		}
	}

	const handleDeleteThread = async (threadId: Id<'threads'>) => {
		try {
			await deleteThread({ threadId })
		} catch (error) {
			console.error('Failed to delete thread:', error)
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const getThreadsByTimeGroup = (threads: any[]) => {
		const now = new Date()
		const yesterday = new Date()
		const weekAgo = new Date()
		const monthAgo = new Date()

		yesterday.setDate(now.getDate() - 1)
		weekAgo.setDate(now.getDate() - 7)
		monthAgo.setDate(now.getDate() - 30)

		const unpinnedThreads = threads.filter((thread) => !thread.pinned)

		return {
			today: unpinnedThreads.filter((thread) => {
				const threadDate = new Date(thread.createdAt)
				return threadDate.toDateString() === now.toDateString()
			}),
			yesterday: unpinnedThreads.filter((thread) => {
				const threadDate = new Date(thread.createdAt)
				return threadDate.toDateString() === yesterday.toDateString()
			}),
			lastWeek: unpinnedThreads.filter((thread) => {
				const threadDate = new Date(thread.createdAt)
				return (
					threadDate >= weekAgo &&
					threadDate < yesterday &&
					threadDate.toDateString() !== yesterday.toDateString()
				)
			}),
			lastMonth: unpinnedThreads.filter((thread) => {
				const threadDate = new Date(thread.createdAt)
				return threadDate >= monthAgo && threadDate < weekAgo
			}),
			older: unpinnedThreads.filter((thread) => {
				const threadDate = new Date(thread.createdAt)
				return threadDate < monthAgo
			}),
		}
	}

	const transition = {
		stiffness: 320,
		damping: 20,
		mass: 0.8,
		type: 'spring' as const,
	}

	const threadGroups = getThreadsByTimeGroup(filteredThreads)

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const renderThreadGroup = (groupThreads: any[], groupName: string) => {
		if (groupThreads.length === 0) return null

		return (
			<div key={groupName}>
				<AnimatePresence>
					<motion.p
						layout
						key={`${groupName}-label`}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.22, ease: 'easeInOut' }}
						className="font-medium px-3 text-sidebar-foreground/70 text-xs mb-2"
					>
						{groupName}
					</motion.p>
				</AnimatePresence>
				<div
					className={cn(
						'space-y-2 relative mb-6',
						togglingGroup === 'unpinned' ? 'z-5' : 'z-10'
					)}
				>
					{groupThreads.map((thread) => (
						<motion.div
							key={thread.id}
							layoutId={`thread-${thread.id}`}
							transition={transition}
							className="group/thread"
						>
							<motion.a
								href={`/chat/${thread.id}`}
								className="flex items-center justify-between gap-3 rounded-lg hover:bg-sidebar-accent p-2 transition-colors"
							>
								<div className="flex items-center gap-2 min-w-0 flex-1">
									<div className="rounded-md bg-sidebar-accent/20 p-1.5">
										<MessageSquare
											className="size-4 text-sidebar-foreground dark:text-white"
											animateOnHover
										/>
									</div>
									<div className="min-w-0 flex-1">
										<div className="text-xs font-medium text-sidebar-foreground truncate">
											{thread.title || 'New Chat'}
										</div>
										<div className="text-xs text-sidebar-foreground/60">
											{new Date(thread.createdAt).toLocaleDateString()}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-1 opacity-0 group-hover/thread:opacity-100 transition-opacity duration-200">
									<motion.button
										onClick={(e) => {
											e.preventDefault()
											e.stopPropagation()
											handleTogglePin(thread.id, false)
										}}
										className="flex items-center justify-center size-7 text-muted-foreground"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Pin className="size-3 fill-current" animateOnHover />
									</motion.button>
									<motion.button
										onClick={(e) => {
											e.preventDefault()
											e.stopPropagation()
											handleDeleteThread(thread.id)
										}}
										className="flex items-center justify-center size-7 text-destructive rounded-lg hover:bg-destructive/80 hover:text-destructive-foreground transition-colors"
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Trash className="size-3" animateOnHover />
									</motion.button>
								</div>
							</motion.a>
						</motion.div>
					))}
				</div>
			</div>
		)
	}

	return (
		<SidebarContent className="overflow-hidden group-data-[collapsible=icon]:overflow-hidden">
			<motion.div className="space-y-6 p-4 overflow-y-auto scrollbar-hide group-data-[collapsible=icon]:hidden">
				<LayoutGroup>
					{/* Pinned Threads Section */}
					<div>
						<AnimatePresence>
							{filteredPinnedThreads && filteredPinnedThreads.length > 0 && (
								<motion.p
									layout
									key="pinned-label"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.22, ease: 'easeInOut' }}
									className="font-medium px-3 text-sidebar-foreground/70 text-xs mb-2 flex items-center gap-2"
								>
									<Pin className="size-4" />
									Pinned
								</motion.p>
							)}
						</AnimatePresence>
						{filteredPinnedThreads && filteredPinnedThreads.length > 0 && (
							<div
								className={cn(
									'space-y-2 relative',
									togglingGroup === 'pinned' ? 'z-5' : 'z-10'
								)}
							>
								{filteredPinnedThreads.map((thread) => (
									<motion.div
										key={thread.id}
										layoutId={`thread-${thread.id}`}
										transition={transition}
										className="group/thread"
									>
										<motion.a
											href={`/chat/${thread.id}`}
											className="flex items-center justify-between gap-3 rounded-lg bg-sidebar-accent p-2 hover:bg-sidebar-accent/80 transition-colors"
										>
											<div className="flex items-center gap-2 min-w-0 flex-1">
												<div className="rounded-md bg-primary p-1.5">
													<MessageSquare
														className="size-8 text-sidebar-foreground dark:fill-white"
														animateOnHover
													/>
												</div>
												<div className="min-w-0 flex-1">
													<div className="text-xs font-medium text-sidebar-accent-foreground truncate">
														{thread.title || 'New Chat'}
													</div>
													<div className="text-xs text-sidebar-accent-foreground/60">
														{new Date(thread.createdAt).toLocaleDateString()}
													</div>
												</div>
											</div>
											<div className="flex items-center gap-1 opacity-0 group-hover/thread:opacity-100 transition-opacity duration-200">
												<motion.button
													onClick={(e) => {
														e.preventDefault()
														e.stopPropagation()
														handleTogglePin(thread.id, true)
													}}
													className="flex items-center justify-center size-7 text-primary"
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
												>
													<PinOff
														className="size-3 fill-current"
														animateOnHover
													/>
												</motion.button>
												<motion.button
													onClick={(e) => {
														e.preventDefault()
														e.stopPropagation()
														handleDeleteThread(thread.id)
													}}
													className="flex items-center justify-center size-7 text-destructive rounded-lg hover:bg-destructive/80 hover:text-destructive-foreground transition-colors"
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
												>
													<Trash className="size-3" animateOnHover />
												</motion.button>
											</div>
										</motion.a>
									</motion.div>
								))}
							</div>
						)}
					</div>

					{/* Time-based Thread Groups */}
					{renderThreadGroup(threadGroups.today, 'Today')}
					{renderThreadGroup(threadGroups.yesterday, 'Yesterday')}
					{renderThreadGroup(threadGroups.lastWeek, 'Last 7 Days')}
					{renderThreadGroup(threadGroups.lastMonth, 'Last 30 Days')}
					{renderThreadGroup(threadGroups.older, 'Older')}

					{/* No chats message */}
					{threads?.length === 0 && (
						<div className="px-3 py-6 text-center">
							<div className="text-sm text-sidebar-foreground/60">
								No chats yet. Start a new conversation!
							</div>
						</div>
					)}

					{/* No search results message */}
					{searchQuery.trim() &&
						filteredThreads.length === 0 &&
						filteredPinnedThreads.length === 0 &&
						threads &&
						threads.length > 0 && (
							<div className="px-3 py-6 text-center">
								<div className="text-sm text-sidebar-foreground/60">
									No threads found for &quot;{searchQuery}&quot;
								</div>
							</div>
						)}
				</LayoutGroup>
			</motion.div>
		</SidebarContent>
	)
}
