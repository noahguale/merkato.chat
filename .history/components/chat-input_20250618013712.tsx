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
import { useCallback, useState, type FormEventHandler, useRef } from 'react'
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
	attachments: Array<Attachment>
	setAttachments: (attachments: Array<Attachment>) => void
}

export const ChatInput = ({
	input,
	currentModel,
	setCurrentModel,
	handleFormSubmit,
	handleInputChange,
	attachments,
	setAttachments,
}: ChatInputProps) => {
	const [uploadQueue, setUploadQueue] = useState<Array<string>>([])
	const fileInputRef = useRef<HTMLInputElement>(null)

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
			} else {
				const { error } = await response.json()
				toast.error(error)
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

				setAttachments([...attachments, ...successfullyUploadedAttachments])
			} catch (error) {
				console.error('Error uploading files!', error)
			} finally {
				setUploadQueue([])
			}
		},
		[attachments, setAttachments]
	)

	// const removeAttachment = (index: number) => {
	// 	setAttachments(attachments.filter((_, i) => i !== index))
	// }

	return (
		<>
			{/* Hidden file input */}
			<input
				type="file"
				ref={fileInputRef}
				multiple
				className="hidden"
				onChange={handleFileChange}
				accept="image/*,text/*,.pdf,.doc,.docx,.json,.csv"
			/>

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
						<AIInputButton
							onClick={() => fileInputRef.current?.click()}
							type="button"
						>
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

					<AIInputSubmit disabled={uploadQueue.length > 0}>
						<SendIcon className="h-4 w-4" />
					</AIInputSubmit>
				</AIInputToolbar>
			</AIInput>
		</>
	)
}
