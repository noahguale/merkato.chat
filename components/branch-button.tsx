'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { GitBranch } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useNavigate } from 'react-router'
import { useModelStore } from '@/store/model-store'
import { Id } from '@/convex/_generated/dataModel'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog'
import { Textarea } from './ui/textarea'

interface BranchButtonProps {
	messageId: string
	messageContent: string
	className?: string
}

export const BranchButton = ({ 
	messageId, 
	messageContent, 
	className 
}: BranchButtonProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [newMessage, setNewMessage] = useState('')
	const [isCreating, setIsCreating] = useState(false)
	
	const navigate = useNavigate()
	const currentModel = useModelStore((state) => state.currentModel)
	const createBranch = useMutation(api.chat.createBranchFromMessage)

	const handleCreateBranch = async () => {
		if (!newMessage.trim() || !currentModel) return

		setIsCreating(true)
		try {
			const branchThreadId = await createBranch({
				messageId: messageId as Id<'messages'>,
				newUserMessage: newMessage.trim(),
				model: currentModel,
			})

			navigate(`/chat/${branchThreadId}`)
			setIsOpen(false)
			setNewMessage('')
		} catch (error) {
			console.error('Failed to create branch:', error)
		} finally {
			setIsCreating(false)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className={`opacity-0 group-hover:opacity-100 transition-opacity ${className}`}
				>
					<GitBranch className="size-4" />
					<span className="sr-only">Branch conversation</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>Branch Conversation</DialogTitle>
					<DialogDescription>
						Create a new thread starting from this message. The conversation history up to this point will be copied to the new thread.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="rounded-lg bg-muted p-3">
						<p className="text-sm text-muted-foreground mb-2">Branching from:</p>
						<p className="text-sm">{messageContent}</p>
					</div>
					<div>
						<label htmlFor="new-message" className="text-sm font-medium">
							Your new message:
						</label>
						<Textarea
							id="new-message"
							placeholder="Type your alternative message or question..."
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							className="mt-1"
							rows={3}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button 
						variant="outline" 
						onClick={() => setIsOpen(false)}
						disabled={isCreating}
					>
						Cancel
					</Button>
					<Button 
						onClick={handleCreateBranch}
						disabled={!newMessage.trim() || isCreating}
					>
						{isCreating ? 'Creating...' : 'Create Branch'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}