'use client'

import {
	AIMessage,
	// AIMessageAvatar,
	AIMessageContent,
} from '@/components/ui/ai/message'

import { AIResponse } from '@/components/ui/ai/response'
import { UIMessage } from 'ai'
import {
	AIReasoning,
	AIReasoningTrigger,
	AIReasoningContent,
} from './ui/ai/reasoning'

interface ChatMessageProps {
	messages: UIMessage[]
}

export const ChatMessage = ({ messages }: ChatMessageProps) => {
	return (
		<>
			{messages.map((message) => (
				<div key={message.id}>
					{message.parts ? (
						// Handle messages with parts (reasoning + text)
						message.parts.map((part, index) => {
							if (part.type === 'reasoning') {
								return (
									<AIReasoning key={`${message.id}-reasoning-${index}`}>
										<AIReasoningTrigger />
										<AIReasoningContent>{message.content}</AIReasoningContent>
									</AIReasoning>
								)
							}

							if (part.type === 'text') {
								return (
									<AIMessage
										key={`${message.id}-text-${index}`}
										from={message.role as 'user' | 'assistant'}
									>
										<AIMessageContent>
											<AIResponse className="">{message.content}</AIResponse>
										</AIMessageContent>
									</AIMessage>
								)
							}

							return null
						})
					) : (
						// Handle regular messages without parts
						<AIMessage from={message.role as 'user' | 'assistant'}>
							<AIMessageContent>
								<AIResponse className="">{message.content}</AIResponse>
							</AIMessageContent>
						</AIMessage>
					)}
				</div>
			))}
		</>
	)
}
