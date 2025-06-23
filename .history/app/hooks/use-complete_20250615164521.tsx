import { useCompletion } from '@ai-sdk/react'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'

interface TitleResponse {
	threadId: string
	title: string
}

export const useCompete = ({ content }) => {
	const updateThreadTitle = useMutation(api.chat.updateThreadTitle)

	const { completion } = useCompletion({
		api: '/api/thread/title',
		onResponse: async (response) => {
			try {
				const titleReponse: TitleResponse = await response.json()

				if (response.ok) {
					const { threadId, title } = titleReponse

					if (threadId) {
						await updateThreadTitle({ threadId, title })
					}

					return titleReponse.title
				}
			} catch (error) {
				console.error('[ERROR]: ', error)
			}
		},
	})
	return { completion }
}
