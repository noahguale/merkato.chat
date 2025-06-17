'use client'

import * as React from 'react'
import { type DialogProps } from '@radix-ui/react-dialog'
import { CornerDownLeftIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useIsMac } from '@/app/hooks/use-is-mac'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'

interface CommandMenuItemData {
	id: string
	label: string
	icon?: React.ReactNode
	action?: () => void
	keywords?: string[]
}

interface SimpleCommandMenuProps extends DialogProps {
	placeholder?: string
	items?: CommandMenuItemData[]
	onItemSelect?: (item: CommandMenuItemData) => void
	triggerClassName?: string
	triggerText?: string
}

export function CommandMenu({
	placeholder = 'Search...',
	items = [],
	onItemSelect,
	triggerClassName,
	triggerText = 'Search...',
	...props
}: SimpleCommandMenuProps) {
	const isMac = useIsMac()
	const [selectedItem, setSelectedItem] =
		React.useState<CommandMenuItemData | null>(null)
	
	// Use props.open and props.onOpenChange if provided, otherwise use internal state
	const [internalOpen, setInternalOpen] = React.useState(false)
	const open = props.open !== undefined ? props.open : internalOpen
	const setOpen = props.onOpenChange || setInternalOpen

	const runCommand = React.useCallback((command: () => unknown) => {
		setOpen(false)
		command()
	}, [])

	// Remove built-in keyboard shortcuts - let parent components handle them

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="secondary"
					className={cn(
						'bg-surface text-surface-foreground/60 dark:bg-card relative h-8 w-full justify-start pl-2.5 font-normal shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64',
						triggerClassName
					)}
					onClick={() => setOpen(true)}
					{...props}
				>
					<span className="hidden lg:inline-flex">{triggerText}</span>
					<span className="inline-flex lg:hidden">Search...</span>
					<div className="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
						<CommandMenuKbd>{isMac ? '⌘' : 'Ctrl'}</CommandMenuKbd>
						<CommandMenuKbd className="aspect-square">K</CommandMenuKbd>
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent
				showCloseButton={false}
				className="rounded-xl border-none bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800"
			>
				<DialogHeader className="sr-only">
					<DialogTitle>{triggerText}</DialogTitle>
					<DialogDescription>Search for a command to run...</DialogDescription>
				</DialogHeader>
				<Command className="**:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input-wrapper]:border-input rounded-none bg-transparent **:data-[slot=command-input]:!h-9 **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:!h-9 **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border">
					<CommandInput placeholder={placeholder} />
					<CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
						<CommandEmpty className="text-muted-foreground py-12 text-center text-sm">
							No results found.
						</CommandEmpty>
						{items.length > 0 && (
							<CommandGroup
								heading="Threads"
								className="!p-0 [&_[cmdk-group-heading]]:scroll-mt-16 [&_[cmdk-group-heading]]:!p-3 [&_[cmdk-group-heading]]:!pb-1"
							>
								{items.map((item) => (
									<CommandMenuItem
										key={item.id}
										value={item.label}
										keywords={item.keywords}
										onHighlight={() => setSelectedItem(item)}
										onSelect={() => {
											runCommand(() => {
												item.action?.()
												onItemSelect?.(item)
											})
										}}
									>
										{item.icon}
										{item.label}
									</CommandMenuItem>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
				<div className="text-muted-foreground absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium dark:border-t-neutral-700 dark:bg-neutral-800">
					<div className="flex items-center gap-2">
						<CommandMenuKbd>
							<CornerDownLeftIcon />
						</CommandMenuKbd>
						<span>Go to Thread</span>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

function CommandMenuItem({
	children,
	className,
	onHighlight,
	...props
}: React.ComponentProps<typeof CommandItem> & {
	onHighlight?: () => void
}) {
	const ref = React.useRef<HTMLDivElement>(null)

	// Simple selection tracking without mutation observer
	const handleMouseEnter = () => {
		onHighlight?.()
	}

	return (
		<CommandItem
			ref={ref}
			className={cn(
				'data-[selected=true]:border-input data-[selected=true]:bg-input/50 h-9 rounded-md border border-transparent !px-3 font-medium',
				className
			)}
			onMouseEnter={handleMouseEnter}
			{...props}
		>
			{children}
		</CommandItem>
	)
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<'kbd'>) {
	return (
		<kbd
			className={cn(
				"bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3",
				className
			)}
			{...props}
		/>
	)
}
