'use client'

import { BotMessageSquare } from '@/components/animate-ui/icons/bot-message-square'
import { AnimateIcon } from '@/components/animate-ui/icons/icon'
import { SignInWithGitHub } from '@/components/sign-in'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

export default function Sign() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<a href="#" className="flex items-center gap-2 self-center font-medium">
					<div className="bg-transparent text-primary-foreground flex size-6 items-center justify-center rounded-md">
						<AnimateIcon animate loop loopDelay={2}>
							<div>
								<BotMessageSquare size={20} className="text-primary" />
							</div>
						</AnimateIcon>
					</div>
					<div className="text-xl font-semibold font-ibm-plex-mono">
						<span>merkato</span>
						<span className="text-primary">.chat</span>
					</div>
				</a>
				{/* <LoginForm /> */}
			</div>

			{/* <main className="mx-auto my-auto flex-col flex">
				<h2 className="font-semibold text-2xl tracking-tight mb-4">
					Sign in or create an account
				</h2>
				<SignInWithGitHub />

				<Button variant="link" className="text-muted-foreground" asChild>
					<Link href="/">Cancel</Link>
				</Button>
			</main> */}
		</div>
	)
}
