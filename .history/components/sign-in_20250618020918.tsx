'use client'

import { useAuthActions } from '@convex-dev/auth/react'
import { Button } from '@/components/ui/button'
import { GitHubLogo, Google } from './logos'

export function SignInWithGitHub() {
	const { signIn } = useAuthActions()
	return (
		<Button
			className="flex-1"
			variant="outline"
			type="button"
			onClick={() => void signIn('github', { redirectTo: '/' })}
		>
			<GitHubLogo className="mr-2 h-4 w-4" /> GitHub
		</Button>
	)
}

export function SignInWithGoogle() {
	const { signIn } = useAuthActions()
	return (
		<Button
			className="flex-1"
			variant="outline"
			type="button"
			onClick={() => void signIn('google', { redirectTo: '/' })}
		>
			<Google className="mr-2 h-4 w-4" /> Google
		</Button>
	)
}
