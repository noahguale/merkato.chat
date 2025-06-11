'use client'

import { useChat } from '@ai-sdk/react'
import { useRef, useState } from 'react'
import Image from 'next/image'

export default function Chat() {
	const { messages, sendMessage, status, error } = useChat()

	const [input, setInput] = useState('')
	const [files, setFiles] = useState<FileList | undefined>(undefined)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!input.trim() && !files?.length) return

		const attachments = files
			? Array.from(files).map((file) => ({
					name: file.name,
					contentType: file.type,
					url: URL.createObjectURL(file),
			  }))
			: undefined

		await sendMessage({
			role: 'user',
			content: input,
			...(attachments && { attachments }),
		})

		setInput('')
		setFiles(undefined)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	const renderMessageContent = (message: any) => {
		if (typeof message.content === 'string') {
			return message.content
		}

		if (Array.isArray(message.content)) {
			return message.content
				.map((part: any, index: number) => {
					if (part.type === 'text') {
						return part.text
					}
					return ''
				})
				.join('')
		}

		return ''
	}

	const isLoading = status === 'loading'

	return (
		<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
			{error && <div className="text-red-500 mb-4">Error: {error.message}</div>}

			{messages.map((m) => (
				<div key={m.id} className="whitespace-pre-wrap mb-4">
					{m.role === 'user' ? 'User: ' : 'AI: '}
					{renderMessageContent(m)}
					<div>
						{m?.attachments
							?.filter(
								(attachment) =>
									attachment?.contentType?.startsWith('image/') ||
									attachment?.contentType?.startsWith('application/pdf')
							)
							.map((attachment, index) =>
								attachment.contentType?.startsWith('image/') ? (
									<Image
										key={`${m.id}-${index}`}
										src={attachment.url}
										width={500}
										height={500}
										alt={attachment.name ?? `attachment-${index}`}
									/>
								) : attachment.contentType?.startsWith('application/pdf') ? (
									<iframe
										key={`${m.id}-${index}`}
										src={attachment.url}
										width={500}
										height={600}
										title={attachment.name ?? `attachment-${index}`}
									/>
								) : null
							)}
					</div>
				</div>
			))}

			<form
				className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl space-y-2"
				onSubmit={handleSubmit}
			>
				<input
					type="file"
					className=""
					onChange={(event) => {
						if (event.target.files) {
							setFiles(event.target.files)
						}
					}}
					multiple
					ref={fileInputRef}
					accept="image/*,application/pdf"
				/>
				<input
					className="w-full p-2 border rounded"
					value={input}
					placeholder="Say something..."
					onChange={(e) => setInput(e.target.value)}
					disabled={isLoading}
				/>
				<button
					type="submit"
					disabled={isLoading || (!input.trim() && !files?.length)}
					className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50"
				>
					{isLoading ? 'Sending...' : 'Send'}
				</button>
			</form>
		</div>
	)
}
