'use client'

import {
	AIMessage,
	AIMessageAvatar,
	AIMessageContent,
} from '@/components/ui/ai/message'

import { AIResponse } from '@/components/ui/ai/response'
import { UIMessage } from 'ai'

interface ChatMessageProps {
	messages: UIMessage[]
}

export const ChatMessage = ({ messages }: ChatMessageProps) => {
	return (
		<>
			{messages.map((message) => (
				<AIMessage key={message.id} from={message.role as 'user' | 'assistant'}>
					<AIMessageContent>
						<AIResponse>{message.content}</AIResponse>
					</AIMessageContent>
				</AIMessage>
			))}
		</>
	)
}
