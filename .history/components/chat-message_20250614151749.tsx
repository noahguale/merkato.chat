'use client'

import { AIMessage, AIMessageContent } from '@/components/ui/ai/message'

import { AIResponse } from '@/components/ui/ai/response'
import { UIMessage } from 'ai'

interface ChatMessageProps {
	messages: UIMessage[]
}

export const ChatMessage = ({ messages }: ChatMessageProps) => {
	return (
		<>
			{messages
				.filter(
					(message) => message.role === 'user' || message.role === 'assistant'
				)
				.map((message) => (
					<AIMessage key={message.id} from={message.role}>
						<AIMessageContent>
							<AIResponse>{message.content}</AIResponse>
						</AIMessageContent>
					</AIMessage>
				))}
		</>
	)
}
