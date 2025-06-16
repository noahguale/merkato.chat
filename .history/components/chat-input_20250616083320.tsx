'use client'

import {
	AIInput,
	AIInputButton,
	AIInputModelSelect,
	AIInputModelSelectContent,
	AIInputModelSelectItem,
	AIInputModelSelectTrigger,
	AIInputModelSelectValue,
	AIInputSubmit,
	AIInputTextarea,
	AIInputToolbar,
	AIInputTools,
} from '@/components/ui/ai/input'
// import { useSidebar } from '@/components/animate-ui/radix/sidebar'
import { GlobeIcon, MicIcon, PlusIcon, SendIcon } from 'lucide-react'
import { type FormEventHandler } from 'react'
import { Model, models } from '@/lib/types'
import { ChangeEvent, KeyboardEvent } from 'react'

interface ChatInputProps {
	threadId?: string | null
	input: string
	currentModel: Model
	setCurrentModel: (model: Model) => void
	handleFormSubmit: FormEventHandler
	handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

export const ChatInput = ({
	input,
	currentModel,
	setCurrentModel,
	handleFormSubmit,
	handleInputChange,
}: ChatInputProps) => {
	return (
		<AIInput
			className="fixed bottom-0 mb-8 px-4 z-[100] bg-background/95 backdrop-blur-sm border-t shadow-lg transition-all duration-200 ease-in-out"
			onSubmit={handleFormSubmit}
		>
			<AIInputTextarea
				value={input}
				placeholder="Say something..."
				onChange={handleInputChange}
				onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
					if (e.key === 'Enter' && !e.shiftKey) {
						e.preventDefault()
						handleFormSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
					}
				}}
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
								<AIInputModelSelectItem key={model} value={model}>
									{model}
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
	)
}
