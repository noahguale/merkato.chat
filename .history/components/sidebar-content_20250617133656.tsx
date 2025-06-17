import { Pin, MessageSquare } from 'lucide-react'
import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from './animate-ui/radix/sidebar'
import { ThreadPinButton } from './thread-pin-button'
import { Thread } from '@/lib/types'

interface SidebarContentProps {
	pinnedThreads: Thread[]
	threads: Thread[]
}

export const SideContent = ({
	pinnedThreads,
	threads,
}: SidebarContentProps) => {
	return (
		<SidebarContent>
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
	)
}
