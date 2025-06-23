import { useCompletion } from '@ai-sdk/react'

interface UseCompeteProps {
	title: string
}

export const useCompete = ({ content }: UseCompeteProps) => {
	const { completion } = useCompletion({
		api: '/api/thread/title',
		onResponse: async (response) => {
			console.log(response)
			const data = await response.json()
		},
	})
	return { completion }
}
