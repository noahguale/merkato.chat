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

	return (
		<main className="flex flex-col w-full max-w-4xl pt-10 mx-auto size-full  ">
			{/* <div className="flex justify-center items-start min-h-full px-4">
				<ChatMessage messages={messages} />
			</div> */}
			<AIConversation className="flex justify-center items-start min-h-full px-4">
				<AIConversationContent>
					{/* <ChatMessage messages={messages} /> */}
					{messages.map((message) => (
						<AIMessage
							key={message.id}
							from={message.role as 'user' | 'assistant'}
						>
							<AIMessageContent>
								<AIResponse className="font-ibm-plex-mono">
									{message.content}
								</AIResponse>
							</AIMessageContent>
						</AIMessage>
					))}
				</AIConversationContent>
				<div className="flex justify-center items-start min-h-full px-4">
					<AIConversationScrollButton />
				</div>{' '}
			</AIConversation>
			<div className="w-full px-4 pb-4 sticky bottom-0">
				<ChatInput
					input={input}
					currentModel={currentModel}
					setCurrentModel={setCurrentModel}
					handleFormSubmit={handleFormSubmit}
					handleInputChange={handleInputChange}
				/>
			</div>{' '}
		</main>
	)
}
