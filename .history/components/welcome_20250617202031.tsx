'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Bot } from 'lucide-react'

export const Welcome = () => {
	const user = useQuery(api.users.getCurrentUser)

	if (!user) {
		return null
	}

	return (
		<div className="flex h-max flex-col items-start justify-center gap-2">
			<div className="flex items-center gap-2">
				<Bot className="size-10 animate-bounce" />
				<h1 className="font-geist font-bold text-3xl  text-center max-w-xl">
					How can I help you, {user.name}?
				</h1>
			</div>
		</div>
	)
}
