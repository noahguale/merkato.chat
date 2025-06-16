import { useCompletion } from '@ai-sdk/react'

export const useCompete = () => {
	const { completion } = useCompletion({
		api: '/api/thread/title',
	})
}
