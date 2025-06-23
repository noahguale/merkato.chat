'use client'

import * as React from 'react'
import { Key } from 'lucide-react'

import { CommandDialog } from '@/components/ui/command'
import { ProviderConfigForm } from './forms/provider-config-form'
import { Button } from './ui/button'

export function KeyCommand() {
	const [open, setOpen] = React.useState(false)

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen((open) => !open)
			}
		}

		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [])

	return (
		<div className=" ">
			<Button
				variant="ghost"
				size="icon"
				className="group/toggle extend-touch-target size-8"
				title="API Keys"
				onClick={() => setOpen(true)}
			>
				<Key className="size-4" />
				{/* <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
					<span className="text-xs">⌘</span>J
				</kbd> */}
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<div className="p-6">
					<h1 className="text-xl font-bold mb-2">Manage API Keys</h1>
					<ProviderConfigForm />
				</div>
			</CommandDialog>
		</div>
	)
}
