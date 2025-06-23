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
			<h1 className="font-geist font-bold text-3xl line-height-1 text-center ">
				How can I help you {user.name}?
			</h1>
			<p className="tracking-tight  max-w-lg text-pretty text-center">
				merkato is a next-generation AI chat application designed for{' '}
				<span className="whitespace-nowrap">high-performance</span>{' '}
				conversations with multiple AI models.
			</p>
		</div>
	)
}
