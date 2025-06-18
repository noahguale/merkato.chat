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
import { useCallback, useState, type FormEventHandler } from 'react'
import { Model, models } from '@/lib/types'
import { ChangeEvent, KeyboardEvent } from 'react'
import { toast } from 'sonner'
import { Attachment } from 'ai'

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
	const [attachments, setAttachments] = useState<Array<Attachment>>([])
	const [uploadQueue, setUploadQueue] = useState<Array<string>>([])

	const uploadFile = async (file: File) => {
		const formData = new FormData()
		formData.append('file', file)

		try {
			const response = await fetch('/api/files/upload', {
				method: 'POST',
				body: formData,
			})

			if (response.ok) {
				const data = await response.json()
				const { url, pathname, contentType } = data

				return {
					url,
					name: pathname,
					contentType: contentType,
				}
			}
		} catch (error) {
			console.error('Failed to upload file:', error)
			toast.error('Failed to upload file, please try again!')
		}
	}

	const handleFileChange = useCallback(
		async (event: ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(event.target.files || [])

			setUploadQueue(files.map((file) => file.name))

			try {
				const uploadPromises = files.map((file) => uploadFile(file))
				const uploadedAttachments = await Promise.all(uploadPromises)
				const successfullyUploadedAttachments = uploadedAttachments.filter(
					(attachment) => attachment !== undefined
				)

				setAttachments((currentAttachments) => [
					...currentAttachments,
					...successfullyUploadedAttachments,
				])
			} catch (error) {
				console.error('Error uploading files!', error)
			} finally {
				setUploadQueue([])
			}
		},
		[setAttachments]
	)

	return (
		<AIInput onSubmit={handleFormSubmit} className="rounded-lg">
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
