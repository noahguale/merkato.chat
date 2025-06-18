import { type Attachment } from 'ai'
import { LoaderIcon, XIcon, FileIcon, ImageIcon, FileTextIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PreviewAttachmentProps {
	attachment: Attachment
	isUploading?: boolean
	onRemove?: () => void
}

export function PreviewAttachment({ 
	attachment, 
	isUploading = false,
	onRemove 
}: PreviewAttachmentProps) {
	const { name, contentType, url } = attachment

	const getFileIcon = () => {
		if (isUploading) {
			return <LoaderIcon className="animate-spin size-4" />
		}

		if (contentType?.startsWith('image/')) {
			return <ImageIcon className="size-4" />
		}

		if (contentType?.includes('text/') || contentType?.includes('json')) {
			return <FileTextIcon className="size-4" />
		}

		return <FileIcon className="size-4" />
	}

	const isImage = contentType?.startsWith('image/') && url

	return (
		<div className="relative">
			{isImage ? (
				<div className="relative group">
					<img
						src={url}
						alt={name}
						className="size-20 object-cover rounded-lg border"
					/>
					{!isUploading && onRemove && (
						<Button
							size="sm"
							variant="destructive"
							className="absolute -top-2 -right-2 size-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
							onClick={onRemove}
						>
							<XIcon className="size-3" />
						</Button>
					)}
					{isUploading && (
						<div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
							<LoaderIcon className="animate-spin size-6 text-white" />
						</div>
					)}
				</div>
			) : (
				<div className="group relative flex items-center gap-2 p-2 border rounded-lg bg-muted max-w-48">
					<div className="flex-shrink-0">
						{getFileIcon()}
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-xs font-medium truncate">{name}</p>
						{contentType && (
							<p className="text-xs text-muted-foreground">{contentType}</p>
						)}
					</div>
					{!isUploading && onRemove && (
						<Button
							size="sm"
							variant="destructive"
							className="absolute -top-2 -right-2 size-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
							onClick={onRemove}
						>
							<XIcon className="size-3" />
						</Button>
					)}
				</div>
			)}
		</div>
	)
}