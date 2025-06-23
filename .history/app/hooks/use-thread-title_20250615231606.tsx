import { useCompletion } from '@ai-sdk/react'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { Id } from '@/convex/_generated/dataModel'

interface TitleResponse {
	title: string
	threadId: Id<'threads'> | undefined
	needTitle: boolean
}

export const useThreadTitle = () => {
	const updateThreadTitle = useMutation(api.chat.updateThreadTitle)

	const { complete, isLoading } = useCompletion({
		api: '/api/completion',
		onResponse: async (response) => {
			try {
				const { title, threadId, needTitle }: TitleResponse =
					await response.json()

				if (response.ok) {
					if (needTitle && threadId) {
						await updateThreadTitle({ threadId, title })
					}
					return
				}
			} catch (error) {
				console.error('[ERROR]: ', error)
			}
		},
	})
	return { complete, isLoading }
}
