import { api } from '@/convex/_generated/api'
import { useModelStore } from '@/store/model-store'
import { Message, useChat } from '@ai-sdk/react'
import { useMutation, useQuery } from 'convex/react'
import { useNavigate } from 'react-router'
import { Id } from '@/convex/_generated/dataModel'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { useThreadTitle } from '@/app/hooks/use-thread-title'
import {
	AIConversation,
	AIConversationContent,
	AIConversationScrollButton,
} from './ui/ai/conversation'
import { AIMessage, AIMessageContent } from './ui/ai/message'
import { AIResponse } from './ui/ai/response'
import Example from './example'

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
	let currentThreadId = threadId

	const thread = useQuery(
		api.chat.getThread,
		threadId ? { threadId: threadId as Id<'threads'> } : 'skip'
	)

	const { messages, input, handleInputChange, handleSubmit } = useChat({
		initialMessages,
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

		handleSubmit(e)
	}

	const testMessages = [
		...messages,
		...Array(20)
			.fill(null)
			.map((_, i) => ({
				id: `test-${i}`,
				role: 'assistant',
				content: `Test message ${i} - Lorem ipsum dolor sit amet consectetur adipisicing elit.`,
			})),
	]
	return <Example />
}
