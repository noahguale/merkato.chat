'use client'

import * as React from 'react'
import { Key } from 'lucide-react'

import { CommandDialog } from '@/components/ui/command'
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
			<div className="text-muted-foreground text-sm flex items-center gap-2 p-2">
				<Key className="size-4" />
				<kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
					<span className="text-xs">⌘</span>J
				</kbd>
			</div>
			<CommandDialog open={open} onOpenChange={setOpen}>
				{/* <CommandInput placeholder="Type a command or search..." /> */}
				{/* <CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Suggestions">
						<CommandItem>
							<Calendar />
							<span>Calendar</span>
						</CommandItem>
						<CommandItem>
							<Smile />
							<span>Search Emoji</span>
						</CommandItem>
						<CommandItem>
							<Calculator />
							<span>Calculator</span>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Settings">
						<CommandItem>
							<User />
							<span>Profile</span>
							<CommandShortcut>⌘P</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<CreditCard />
							<span>Billing</span>
							<CommandShortcut>⌘B</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<Settings />
							<span>Settings</span>
							<CommandShortcut>⌘S</CommandShortcut>
						</CommandItem>
					</CommandGroup>
				</CommandList> */}
				<div className="p-6">
					<h1 className="text-xl font-bold mb-2">Manage API Keys</h1>
					<ProviderConfigForm />
				</div>
			</CommandDialog>
		</div>
	)
}
