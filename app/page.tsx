'use client'

import { useChat } from '@ai-sdk/react'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { AIMessage, AIMessageContent } from '@/components/ui/ai/message'
import {
	AIInput,
	AIInputTextarea,
	AIInputToolbar,
	AIInputTools,
	AIInputModelSelect,
	AIInputModelSelectTrigger,
	AIInputModelSelectValue,
	AIInputModelSelectContent,
	AIInputModelSelectItem,
	AIInputSubmit,
	AIInputButton,
} from '@/components/ui/ai/input'
import { GlobeIcon, MicIcon, PlusIcon, SendIcon } from 'lucide-react'

const models = [
	{ id: 'gpt-4', name: 'GPT-4', provider: 'openai.com' },
	{ id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai.com' },
	{ id: 'claude-2', name: 'Claude 2', provider: 'anthropic.com' },
	{ id: 'claude-instant', name: 'Claude Instant', provider: 'anthropic.com' },
	{ id: 'palm-2', name: 'PaLM 2', provider: 'google.com' },
	{ id: 'llama-2-70b', name: 'Llama 2 70B', provider: 'meta.com' },
	{ id: 'llama-2-13b', name: 'Llama 2 13B', provider: 'meta.com' },
	{ id: 'cohere-command', name: 'Command', provider: 'cohere.com' },
	{ id: 'mistral-7b', name: 'Mistral 7B', provider: 'mistral.ai' },
]

export default function Chat() {
	const { messages, input, handleInputChange, handleSubmit } = useChat({
		onFinish: async (message) => {
			await saveMessage({
				content: message.content,
				role: 'assistant',
			})
		},
	})

	const [selectedModel, setSelectedModel] = useState('gpt-4')

	const saveMessage = useMutation(api.chat.createMessage)

	const handleFormSubmit = async (e: any) => {
		e.preventDefault()

		if (!input.trim()) return

		try {
			await saveMessage({
				content: input,
				role: 'user',
			})
		} catch (error) {
			console.error('Failed to save message:', error)
		}

		handleSubmit(e)
	}

	return (
		<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
			{messages.map((m) => (
				<div key={m.id} className="whitespace-pre-wrap">
					<AIMessage key={m.id} from={m.role === 'user' ? 'user' : 'assistant'}>
						<AIMessageContent>{m.content}</AIMessageContent>
					</AIMessage>
				</div>
			))}

			<AIInput
				className="fixed bottom-0 w-full max-w-md mb-8"
				onSubmit={handleFormSubmit}
			>
				<AIInputTextarea
					value={input}
					placeholder="Say something..."
					onChange={handleInputChange}
				/>

				<AIInputToolbar>
					<AIInputTools>
						<AIInputButton>
							<PlusIcon size={16} />
						</AIInputButton>
						<AIInputButton>
							<MicIcon size={16} />
						</AIInputButton>
						<AIInputButton>
							<GlobeIcon size={16} />
							<span>Search</span>
						</AIInputButton>

						<AIInputModelSelect
							value={selectedModel}
							onValueChange={setSelectedModel}
						>
							<AIInputModelSelectTrigger>
								<AIInputModelSelectValue />
							</AIInputModelSelectTrigger>
							<AIInputModelSelectContent>
								{models.map((model) => (
									<AIInputModelSelectItem key={model.id} value={model.id}>
										{model.name}
									</AIInputModelSelectItem>
								))}
							</AIInputModelSelectContent>
						</AIInputModelSelect>
					</AIInputTools>

					<AIInputSubmit>
						<SendIcon className="h-4 w-4" />
					</AIInputSubmit>
				</AIInputToolbar>
			</AIInput>
		</div>
	)
}
