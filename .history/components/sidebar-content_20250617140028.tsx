'use client'

import { MessageSquare } from 'lucide-react'
import { motion, LayoutGroup, AnimatePresence } from 'motion/react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { SidebarContent } from './animate-ui/radix/sidebar'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Pin } from './animate-ui/icons/pin'
import { PinOff } from './animate-ui/icons/pin-off'
import { AnimateIcon } from './animate-ui/icons/icon'

export const SideContent = () => {
	const threads = useQuery(api.chat.getThreads)
	const pinnedThreads = useQuery(api.chat.getPinnedThreads)
	const togglePin = useMutation(api.chat.toggleThreadPin)

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

	const transition = {
		stiffness: 320,
		damping: 20,
		mass: 0.8,
		type: 'spring' as const,
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
													<MessageSquare className="size-4 text-sidebar-foreground" />
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
											<motion.button
												onClick={(e) => {
													e.preventDefault()
													e.stopPropagation()
													handleTogglePin(thread.id, true)
												}}
												className="flex items-center justify-center size-7   text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<PinOff
													className="size-3 fill-current"
													animateOnHover
												/>
											</motion.button>
										</motion.a>
									</motion.div>
								))}
							</div>
						)}
					</div>

					{/* Recent Threads Section */}
					<div>
						<AnimatePresence>
							{threads && threads.filter((t) => !t.pinned).length > 0 && (
								<motion.p
									layout
									key="recent-label"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.22, ease: 'easeInOut' }}
									className="font-medium px-3 text-sidebar-foreground/70 text-xs mb-2"
								>
									Recent Chats
								</motion.p>
							)}
						</AnimatePresence>
						{threads && threads.filter((t) => !t.pinned).length > 0 && (
							<div
								className={cn(
									'space-y-2 relative',
									togglingGroup === 'unpinned' ? 'z-5' : 'z-10'
								)}
							>
								{threads
									.filter((thread) => !thread.pinned)
									.map((thread) => (
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
														<MessageSquare className="size-4 text-sidebar-foreground" />
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
												<motion.button
													onClick={(e) => {
														e.preventDefault()
														e.stopPropagation()
														handleTogglePin(thread.id, false)
													}}
													className="flex items-center justify-center size-7 rounded-full bg-sidebar-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
												>
													<Pin className="size-3 fill-current" animateOnHover />
												</motion.button>
											</motion.a>
										</motion.div>
									))}
							</div>
						)}
						{threads?.length === 0 && (
							<div className="px-3 py-6 text-center">
								<div className="text-sm text-sidebar-foreground/60">
									No chats yet. Start a new conversation!
								</div>
							</div>
						)}
					</div>
				</LayoutGroup>
			</motion.div>
		</SidebarContent>
	)
}
