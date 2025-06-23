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
			<h1 className="font-bold text-3xl text-pretty scroll-mt-24  text-accent-blue text-primary  ">
				How can I help today {user?.name ? `, ${user.name}` : ''}
			</h1>
			<p className="tracking-tight text-start max-w-lg text-pretty">
				merkato is a next-generation AI chat application designed for{' '}
				<span className="whitespace-nowrap">high-performance</span>{' '}
				conversations with multiple AI models.
			</p>
		</div>
	)
}
