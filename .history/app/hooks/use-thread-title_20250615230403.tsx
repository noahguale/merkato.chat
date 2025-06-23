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
		api: '/api/thread/title',
		onResponse: async (response) => {
			try {
				const titleResponse: TitleResponse = await response.json()

				if (response.ok) {
					const { threadId, title } = titleResponse

					if (threadId) {
						await updateThreadTitle({ threadId, title })
					}

					return titleResponse.title
				}
			} catch (error) {
				console.error('[ERROR]: ', error)
			}
		},
	})
	return { complete, isLoading }
}
