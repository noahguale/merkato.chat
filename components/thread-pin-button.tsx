'use client'

import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Pin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ThreadPinButtonProps {
	threadId: Id<'threads'>
	isPinned: boolean
	className?: string
	size?: 'sm' | 'md' | 'lg'
}

export function ThreadPinButton({ 
	threadId, 
	isPinned, 
	className,
	size = 'sm'
}: ThreadPinButtonProps) {
	const togglePin = useMutation(api.chat.toggleThreadPin)

	const handleTogglePin = async (e: React.MouseEvent) => {
		e.preventDefault() // Prevent navigation if used inside a link
		e.stopPropagation()
		
		try {
			await togglePin({ threadId })
		} catch (error) {
			console.error('Failed to toggle pin:', error)
		}
	}

	return (
		<Button
			variant="ghost"
			size={size}
			onClick={handleTogglePin}
			className={cn(
				"p-1 h-auto hover:bg-accent",
				isPinned && "text-primary",
				className
			)}
			title={isPinned ? "Unpin thread" : "Pin thread"}
		>
			<Pin 
				className={cn(
					"transition-colors",
					size === 'sm' && "size-3",
					size === 'md' && "size-4", 
					size === 'lg' && "size-5",
					isPinned && "fill-current"
				)} 
			/>
		</Button>
	)
}