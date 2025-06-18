'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export const Welcome = () => {
	const user = useQuery(api.users.getCurrentUser)

	if (!user) {
		return null
	}

	return (
		<div className="flex h-full flex-col items-start justify-center gap-2">
			<h1 className="font-geist font-bold text-3xl text-primary line-height-1  ">
				How can I help today,
			</h1>
			<span className="text-accent-blue text-4xl font-semibold">
				{user?.name ? `${user.name}` : ''}
			</span>
			<p className="tracking-tight text-start max-w-lg text-pretty">
				merkato is a next-generation AI chat application designed for{' '}
				<span className="whitespace-nowrap">high-performance</span>{' '}
				conversations with multiple AI models.
			</p>
		</div>
	)
}
