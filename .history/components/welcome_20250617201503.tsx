'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export const Welcome = () => {
	const user = useQuery(api.users.getCurrentUser)

	if (!user) {
		return null
	}

	return (
		<div className="flex h-max flex-col items-center justify-center gap-2">
			<h1 className="font-geist font-bold text-3xl  text-center max-w-xl">
				How can I help you {user.name}?
			</h1>
		</div>
	)
}
