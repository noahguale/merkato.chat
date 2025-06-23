import { api } from '@/convex/_generated/api'
import { useModelStore } from '@/store/model-store'
import { Message, useChat } from '@ai-sdk/react'
import { useMutation } from 'convex/react'
import { useNavigate } from 'react-router'
import { Id } from '@/convex/_generated/dataModel'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { useThreadTitle } from '@/app/hooks/use-complete'

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
		} else {
			complete(input.trim(), {
				body: { threadId: currentThreadId },
			})
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
