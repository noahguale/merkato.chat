'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect } from 'react'
import { useMutation, useQuery } from 'convex/react'
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
import { useModelStore } from '@/store/model-store'
import { models } from '@/lib/types'

export default function Chat() {
	const { currentModel, setCurrentModel, getModelConfig } = useModelStore()

	const {
		messages,
		input,
		setInput,
		setMessages,
		append,
		stop,
		reload,
		error,
	} = useChat({
		onFinish: async (message) => {
			if (!currentModel) return

			const saveMessage = useMutation(api.chat.createMessage)

			await saveMessage({
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

	const userProviders = useQuery(api.providerConfig.getUserProviders)

	useEffect(() => {
		if (userProviders) {
			setAvailableProviders(userProviders)
		}
	}, [userProviders, setAvailableProviders])

	console.log('models:', userProviders)

	const saveMessage = useMutation(api.chat.createMessage)

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!input.trim() || !currentModel) return

		try {
			await saveMessage({
				content: input,
				role: 'user',
				model: currentModel,
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
							value={currentModel}
							onValueChange={setCurrentModel}
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
