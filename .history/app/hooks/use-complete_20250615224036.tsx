import { useCompletion } from '@ai-sdk/react'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { Id } from '@/convex/_generated/dataModel'

interface TitleResponse {
	threadId: Id<'threads'> | undefined
	title: string
}

export const useThreadTitle = ({ content }) => {
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
				} else {
					console.error('[ERROR]: ', response)
				}
			} catch (error) {
				console.error('[ERROR]: ', error)
			}
		},
	})
	return { completion }
}
