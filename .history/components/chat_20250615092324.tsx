import { api } from '@/convex/_generated/api'
import { useModelStore } from '@/store/model-store'
import { Message, useChat } from '@ai-sdk/react'
import { useMutation } from 'convex/react'
import { useNavigate } from 'react-router'
import { Id } from '@/convex/_generated/dataModel'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'

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

	const { messages, input, handleInputChange, handleSubmit } = useChat({
		initialMessages,
		onFinish: async (message) => {
			if (!currentModel) return

			const returnedThreadId = await createMessage({
				threadId: threadId ? (threadId as Id<'threads'>) : undefined,
				content: message.content,
				role: 'assistant',
				model: currentModel,
			})

			if (!threadId && returnedThreadId) {
				navigate(`/chat/${returnedThreadId}`, { replace: true })
			}
		},
		body: {
			model: getModelConfig().id,
			provider: getModelConfig().provider,
		},
	})

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!currentModel || !input.trim()) return

		const returnedThreadId = await createMessage({
			threadId: threadId ? (threadId as Id<'threads'>) : undefined,
			content: input,
			role: 'user',
			model: currentModel,
		})

		if (!threadId && returnedThreadId) {
			navigate(`/chat/${returnedThreadId}`, { replace: true })
		}

		handleSubmit(e)
	}

	return (
		<div className="relative w-full">
			<main className="flex flex-col w-full max-w-4xl pt-10 pb-44 mx-auto">
				<div className="flex justify-center items-start min-h-full px-4">
					<div className="w-full">
						<ChatMessage messages={messages} />
					</div>
				</div>
			</main>
			<ChatInput
				input={input}
				currentModel={currentModel}
				setCurrentModel={setCurrentModel}
				handleFormSubmit={handleFormSubmit}
				handleInputChange={handleInputChange}
			/>
		</div>
	)
}
