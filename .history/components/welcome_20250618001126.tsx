'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { AnimateIcon } from './animate-ui/icons/icon'
import { BotMessageSquare } from './animate-ui/icons/bot-message-square'
import { TypingAnimation } from './type'
import { KeyForm } from './forms/key-form'

export const Welcome = () => {
	const user = useQuery(api.users.getCurrentUser)

	if (!user) {
		return null
	}

	return (
		<div className="flex h-max flex-col items-start justify-center gap-2">
			<div className="flex items-center gap-x-6">
				<AnimateIcon animate loop loopDelay={2}>
					<div>
						<BotMessageSquare size={50} className="text-primary" />
					</div>
				</AnimateIcon>
				<TypingAnimation className="text-5xl font-bold leading-[5rem] tracking-[-0.02em]">
					{`How can I help you, ${user.name.split(' ')[0]}?`}
				</TypingAnimation>
			</div>
			<div className="w-full  mb-4">
				<p className="text-base text-muted-foreground">
					You can continue with your existing API key or create a new one.
				</p>
			</div>
			<div className="w-full ">
				<div
					className={
						'relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'
					}
				>
					<span className="relative z-10 bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>
			<KeyForm />
		</div>
	)
}
