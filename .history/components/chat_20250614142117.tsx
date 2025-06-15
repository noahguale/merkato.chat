import { api } from '@/convex/_generated/api'
import { useModelStore } from '@/store/model-store'
import { Message, useChat } from '@ai-sdk/react'
import { useMutation } from 'convex/react'
import { useNavigate } from 'react-router'
import { Id } from '@/convex/_generated/dataModel'

interface ChatProps {
	threadId: string | null
	initialMessages: Message[]
}

export const Chat = ({ threadId, initialMessages }: ChatProps) => {
	const navigate = useNavigate()
	const currentModel = useModelStore((state) => state.currentModel)
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
		<div>
			<div>
				{messages.map((message) => (
					<div key={message.id}>
						<strong>{message.role}:</strong> {message.content}
					</div>
				))}
			</div>
			<form onSubmit={handleFormSubmit}>
				<input
					value={input}
					onChange={handleInputChange}
					placeholder="Type a message..."
				/>
				<button type="submit">Send</button>
			</form>
		</div>
	)
}
