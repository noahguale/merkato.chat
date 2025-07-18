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
		// <div className="flex flex-col py-10 overflow-y-auto w-full max-w-4xl mx-auto">
		<>
			{messages.map((message) => (
				// <div key={message.id}>
				// 	{message.parts && (
				// 		<AIReasoning duration={message.reasoning.duration}>
				// 			<AIReasoningTrigger />
				// 			<AIReasoningContent>
				// 				{message.reasoning.content}
				// 			</AIReasoningContent>
				// 		</AIReasoning>
				// 	)}

				// 	<AIMessage
				// 		key={message.id}
				// 		from={message.role as 'user' | 'assistant'}
				// 	>
				// 		<AIMessageContent>
				// 			<AIResponse className="">{message.content}</AIResponse>
				// 		</AIMessageContent>
				// 	</AIMessage>
				// </div>
				<div key={message.id}>
					{message.parts.map((part, index) => {
						// if (part.type === 'reasoning') {
						// 	return (
						// 		<AIReasoning key={message.id}>
						// 			<AIReasoningTrigger />
						// 			<AIReasoningContent>{part.reasoning}</AIReasoningContent>
						// 		</AIReasoning>
						// 	)
						// }

						{
							;<AIReasoning key={message.id}>
								<AIReasoningTrigger />
								<AIReasoningContent>{part.reasoning}</AIReasoningContent>
							</AIReasoning>
						}
						if (part.type === 'text') {
							return (
								<AIMessage
									key={message.id}
									from={message.role as 'user' | 'assistant'}
								>
									<AIMessageContent>
										<AIResponse className="">{message.content}</AIResponse>
									</AIMessageContent>
								</AIMessage>
							)
						}

						// reasoning parts:
					})}
				</div>
			))}
		</> // </div>
	)
}
