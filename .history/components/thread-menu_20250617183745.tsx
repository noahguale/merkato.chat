'use client'

import * as React from 'react'
import { useQuery } from 'convex/react'
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
import { CornerDownLeftIcon } from 'lucide-react'
import { CommandMenuKbd } from './command-menu'
import { cn } from '@/lib/utils'

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
	const threads = useQuery(api.chat.getThreads)

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
		<>
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
			<div className="text-muted-foreground absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium dark:border-t-neutral-700 dark:bg-neutral-800">
				<div className="flex items-center gap-2">
					<CommandMenuKbd>
						<CornerDownLeftIcon />
					</CommandMenuKbd>
					<span>Go to Thread</span>
				</div>
			</div>
		</>
	)
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<'kbd'>) {
	return (
		<kbd
			className={cn(
				"bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3",
				className
			)}
			{...props}
		/>
	)
}
