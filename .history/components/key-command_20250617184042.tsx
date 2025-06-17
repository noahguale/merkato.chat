'use client'

import * as React from 'react'
import {
	Calculator,
	Calendar,
	CreditCard,
	Settings,
	Smile,
	User,
} from 'lucide-react'

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from '@/components/ui/command'
import { ProviderConfigForm } from './forms/provider-config-form'

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
		<div className="border rounded-lg">
			<p className="text-muted-foreground text-sm">
				Manage API Key{' '}
				<kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
					<span className="text-xs">⌘</span>J
				</kbd>
			</p>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<div className="p-6">
					<h1 className="text-xl font-bold mb-2">Manage API Keys</h1>
					<ProviderConfigForm />
				</div>
			</CommandDialog>
		</div>
	)
}
