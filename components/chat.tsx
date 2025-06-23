import { api } from '@/convex/_generated/api'
import { useModelStore } from '@/store/model-store'
import { Message, useChat } from '@ai-sdk/react'
import { Attachment } from 'ai'
import { useMutation, useQuery } from 'convex/react'
import { useNavigate } from 'react-router'
import { Id } from '@/convex/_generated/dataModel'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { Welcome } from './welcome'
import { useThreadTitle } from '@/app/hooks/use-thread-title'
import { useState } from 'react'
import {
	AIConversation,
	AIConversationContent,
	AIConversationScrollButton,
} from './ui/ai/conversation'
import { toast } from 'sonner'

interface ChatProps {
	threadId: string | null
	initialMessages: Message[]
}

export const Chat = ({ threadId, initialMessages }: ChatProps) => {
	const navigate = useNavigate()
	const currentModel = useModelStore((state) => state.currentModel)
	const setCurrentModel = useModelStore((state) => state.setCurrentModel)
	const getModelConfig = useModelStore((state) => state.getModelConfig)
	const createMessage = useMutation(api.chat.createMessage)
	const [attachments, setAttachments] = useState<Array<Attachment>>([])
	let currentThreadId = threadId

	const thread = useQuery(
		api.chat.getThread,
		threadId ? { threadId: threadId as Id<'threads'> } : 'skip'
	)

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		error,
		isLoading,
		// experimental_resume,
	} = useChat({
		initialMessages,
		onError: (error) => {
			console.error('[CHAT_ERROR]:', error)
			
			// Extract error message from different error types
			let errorMessage = 'Failed to send message. Please try again.'
			
			if (error.message) {
				// Handle specific API errors
				if (error.message.includes('No API key configured')) {
					errorMessage = 'API key not configured. Please add your API key in settings.'
				} else if (error.message.includes('Payment Required') || error.message.includes('credits')) {
					errorMessage = 'Insufficient credits. Please check your API provider account.'
				} else if (error.message.includes('Rate limit')) {
					errorMessage = 'Rate limit exceeded. Please wait a moment and try again.'
				} else if (error.message.includes('Invalid API key')) {
					errorMessage = 'Invalid API key. Please check your API key in settings.'
				} else if (error.message.includes('Unauthorized')) {
					errorMessage = 'Authentication failed. Please check your API key.'
				} else if (error.message.includes('model')) {
					errorMessage = 'Model not available. Please try a different model.'
				} else {
					// Use the actual error message if it's descriptive
					errorMessage = error.message
				}
			}
			
			toast.error(errorMessage)
		},
		onFinish: async (message) => {
			if (!currentModel) return

			await createMessage({
				threadId: currentThreadId
					? (currentThreadId as Id<'threads'>)
					: undefined,
				content: message.content,
				role: 'assistant',
				model: currentModel,
			})
		},
		body: {
			model: getModelConfig().id,
			provider: getModelConfig().provider,
		},
	})

	const { complete } = useThreadTitle()

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!currentModel || !input.trim()) return

		// Start AI streaming immediately with attachments
		handleSubmit(e, {
			experimental_attachments: attachments,
		})

		// Clear attachments after sending
		setAttachments([])

		// Handle database operations asynchronously without blocking
		const returnedThreadId = await createMessage({
			threadId: currentThreadId
				? (currentThreadId as Id<'threads'>)
				: undefined,
			content: input,
			role: 'user',
			model: currentModel,
		})

		if (!currentThreadId && returnedThreadId) {
			currentThreadId = returnedThreadId
			navigate(`/chat/${returnedThreadId}`, { replace: true })
			complete(input.trim(), {
				body: { threadId: returnedThreadId, needTitle: true },
			})
		} else if (currentThreadId && thread && !thread.title) {
			complete(input.trim(), {
				body: { threadId: currentThreadId, needTitle: true },
			})
		}
	}

	return (
		<main className="flex flex-col w-full max-w-4xl pt-10 mx-auto size-full  ">
			<AIConversation className="flex justify-center items-start px-4">
				<AIConversationContent>
					{messages.length === 0 ? (
						<Welcome />
					) : (
						<ChatMessage messages={messages} />
					)}
				</AIConversationContent>
				<AIConversationScrollButton />
			</AIConversation>
			<div className="w-full px-4 pb-4 sticky bottom-0">
				<ChatInput
					input={input}
					currentModel={currentModel}
					setCurrentModel={setCurrentModel}
					handleFormSubmit={handleFormSubmit}
					handleInputChange={handleInputChange}
					attachments={attachments}
					setAttachments={setAttachments}
				/>
			</div>
		</main>
	)
}
