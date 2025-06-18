'use client'

import { useAuthActions } from '@convex-dev/auth/react'
import { Button } from '@/components/ui/button'
import { GitHubLogo } from './logos'

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
