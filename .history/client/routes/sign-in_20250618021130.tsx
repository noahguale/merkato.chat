'use client'

import { SignInWithGitHub } from '@/components/sign-in'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Sign() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col items-center gap-2">
					<a href="#" className="flex flex-col items-center gap-2 font-medium">
						<div className="flex size-8 items-center justify-center rounded-md">
							{/* <GalleryVerticalEnd className="size-6" /> */}
						</div>
						<span className="sr-only">Acme Inc.</span>
					</a>
					<h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
					<div className="text-center text-sm">
						Don&apos;t have an account?{' '}
						<a href="#" className="underline underline-offset-4">
							Sign up
						</a>
					</div>
				</div>

				<main className="mx-auto my-auto flex-col flex">
					<h2 className="font-semibold text-2xl tracking-tight mb-4">
						Sign in or create an account
					</h2>
					<SignInWithGitHub />

					<Button variant="link" className="text-muted-foreground" asChild>
						<Link href="/">Cancel</Link>
					</Button>
				</main>
			</div>
		</div>
	)
}
