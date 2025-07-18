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
			<h1 className="font-geist font-bold text-3xl  text-start ">
				How can I help you {user.name}?
			</h1>
			<p className="tracking-tight  max-w-xl text-pretty text-start">
				merkato is a next-generation AI chat application designed for{' '}
				<span className="whitespace-nowrap">high-performance</span>{' '}
				conversations with multiple AI models.
			</p>
		</div>
	)
}
