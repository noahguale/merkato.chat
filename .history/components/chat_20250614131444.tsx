import { api } from '@/convex/_generated/api'
import { useModelStore } from '@/store/model-store'
import { Message, useChat } from '@ai-sdk/react'
import { useMutation } from 'convex/react'

interface ChatProps {
	threadId: string | null
	initialMessages: Message[]
}

export const Chat = ({ threadId, initialMessages }: ChatProps) => {
	const currentModel = useModelStore((state) => state.currentModel)
	const getModelConfig = useModelStore((state) => state.getModelConfig)

	const { messages, input } = useChat({
		onFinish: async (message) => {
			if (!currentModel) return

			await useMutation(api.chat.createMessage)({
				content: message.content,
				role: 'assistant',
				model: currentModel,
			})
		},
		body: {
			model: currentModel,
			provider: getModelConfig().provider,
		},
	})

	return (
		<div>
			<div>
				{messages.map((message) => (
					<div key={message.id}>{message.content}</div>
				))}
			</div>
		</div>
	)
}
