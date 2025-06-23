'use client'

import { motion, LayoutGroup, AnimatePresence } from 'motion/react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { SidebarContent } from './animate-ui/radix/sidebar'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Pin } from './animate-ui/icons/pin'
import { PinOff } from './animate-ui/icons/pin-off'
import { MessageSquare } from './animate-ui/icons/message-square'
import { Trash } from './animate-ui/icons/trash'
import { Button } from './ui/button'

export const SideContent = () => {
	const threads = useQuery(api.chat.getThreads)
	const pinnedThreads = useQuery(api.chat.getPinnedThreads)
	const togglePin = useMutation(api.chat.toggleThreadPin)
	const deleteThread = useMutation(api.chat.deleteThread)

	const [togglingGroup, setTogglingGroup] = useState<
		'pinned' | 'unpinned' | null
	>(null)

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

	const threadGroups = getThreadsByTimeGroup(threads || [])

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
							className="group"
						>
							<motion.a
								href={`/chat/${thread.id}`}
								className="flex items-center justify-between gap-3 rounded-lg hover:bg-sidebar-accent p-2 transition-colors"
							>
								<div className="flex items-center gap-2 min-w-0 flex-1">
									<div className="rounded-md bg-sidebar-accent/20 p-1.5">
										<MessageSquare
											className="size-4 text-sidebar-foreground"
											animateOnHover
										/>
									</div>
									<div className="min-w-0 flex-1">
										<div className="text-sm font-medium text-sidebar-foreground truncate">
											{thread.title || 'New Chat'}
										</div>
										<div className="text-xs text-sidebar-foreground/60">
											{new Date(thread.createdAt).toLocaleDateString()}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
		<SidebarContent className="overflow-hidden">
			<motion.div className="space-y-6 p-4 overflow-y-auto scrollbar-hide">
				<LayoutGroup>
					{/* Pinned Threads Section */}
					<div>
						<AnimatePresence>
							{pinnedThreads && pinnedThreads.length > 0 && (
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
						{pinnedThreads && pinnedThreads.length > 0 && (
							<div
								className={cn(
									'space-y-2 relative',
									togglingGroup === 'pinned' ? 'z-5' : 'z-10'
								)}
							>
								{pinnedThreads.map((thread) => (
									<motion.div
										key={thread.id}
										layoutId={`thread-${thread.id}`}
										transition={transition}
										className="group"
									>
										<motion.a
											href={`/chat/${thread.id}`}
											className="flex items-center justify-between gap-3 rounded-lg bg-sidebar-accent p-2 hover:bg-sidebar-accent/80 transition-colors"
										>
											<div className="flex items-center gap-2 min-w-0 flex-1">
												<div className="rounded-md bg-sidebar p-1.5">
													<MessageSquare
														className="size-4 text-sidebar-foreground"
														animateOnHover
													/>
												</div>
												<div className="min-w-0 flex-1">
													<div className="text-sm font-medium text-sidebar-accent-foreground truncate">
														{thread.title || 'New Chat'}
													</div>
													<div className="text-xs text-sidebar-accent-foreground/60">
														{new Date(thread.createdAt).toLocaleDateString()}
													</div>
												</div>
											</div>
											<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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

					{/* Search Button */}
					{threads && threads.filter((t) => !t.pinned).length > 0 && (
						<div className="px-3">
							<Button
								variant="glass"
								size="sm"
								onClick={() => {
									// Command window functionality - placeholder for later
									console.log('Command window - to be implemented')
								}}
								className="w-full h-8 text-xs"
							>
								Search...
							</Button>
						</div>
					)}

					{/* No chats message */}
					{threads?.length === 0 && (
						<div className="px-3 py-6 text-center">
							<div className="text-sm text-sidebar-foreground/60">
								No chats yet. Start a new conversation!
							</div>
						</div>
					)}
				</LayoutGroup>
			</motion.div>
		</SidebarContent>
	)
}
