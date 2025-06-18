'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { AnimateIcon } from './animate-ui/icons/icon'
import { BotMessageSquare } from './animate-ui/icons/bot-message-square'

export const Welcome = () => {
	const user = useQuery(api.users.getCurrentUser)

	if (!user) {
		return null
	}

	return (
		<div className="flex h-max flex-col items-start justify-center gap-2">
			<div className="flex items-center gap-x-6">
				<AnimateIcon animate loop loopDelay={2000}>
					<div>
						<BotMessageSquare size={40} className="text-primary" />
					</div>
				</AnimateIcon>
				<h1 className="font-geist font-bold text-3xl  text-center max-w-xl">
					How can I help you, {user.name}?
				</h1>
			</div>
		</div>
	)
}
