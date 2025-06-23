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
			{messages.map((message) => {
				// Debug logging to see message structure
				console.log('Message structure:', {
					id: message.id,
					role: message.role,
					hasParts: !!message.parts,
					partsLength: message.parts?.length,
					contentLength: message.content?.length,
					parts: message.parts,
				})

				return (
					<div key={message.id}>
						{message.parts ? (
							// Handle messages with parts (reasoning models)
							message.parts.map((part, index) => {
								console.log('Processing part:', part.type, part)

								if (part.type === 'reasoning') {
									// Extract reasoning content from details array
									const reasoningText = part.details
										? part.details
												.filter((detail) => detail.type === 'text')
												.map((detail) => detail.text)
												.join('\n')
										: part.reasoning || 'No reasoning content available'

									return (
										<AIReasoning key={`${message.id}-reasoning-${index}`}>
											<AIReasoningTrigger />
											<AIReasoningContent>{reasoningText}</AIReasoningContent>
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
												<AIResponse className="">{part.text}</AIResponse>
											</AIMessageContent>
										</AIMessage>
									)
								}

								if (part.type === 'source') {
									return (
										<span key={`source-${part.source.id}`}>
											[
											<a href={part.source.url} target="_blank">
												{part.source.title ?? new URL(part.source.url).hostname}
											</a>
											]
										</span>
									)
								}
								// Handle any other part types
								return (
									<div key={`${message.id}-unknown-${index}`}>
										Unknown part type: {part.type}
									</div>
								)
							})
						) : (
							// Fallback for regular messages without parts
							<AIMessage from={message.role as 'user' | 'assistant'}>
								<AIMessageContent>
									<AIResponse className="">{message.content}</AIResponse>
								</AIMessageContent>
							</AIMessage>
						)}
					</div>
				)
			})}
		</>
	)
}
