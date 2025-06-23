import {
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from './animate-ui/radix/sidebar'
import { Button } from './ui/button'
import { Kbd, KbdKey } from './ui/kdb'
import { applicationName } from '@/lib/config'

export const SideHeader = () => {
	return (
		<SidebarHeader className="flex flex-col gap-2 relative m-1 mb-0 space-y-1 p-0 !pt-safe">
			<h1 className="flex h-8 shrink-0 items-center justify-center text-lg text-muted-foreground transition-opacity delay-75 duration-75">
				<SidebarTrigger className="-ml-1" />
				<a
					href="/chat"
					className="relative flex h-8 w-24 items-center justify-center text-sm font-semibold text-foreground"
				>
					<span className="font-lora truncate font-semibold">merkato.chat</span>
				</a>
			</h1>
			{/* <SidebarMenu>
				<SidebarMenuItem className="flex w-full items-center">
					<SidebarTrigger className="-ml-1" />
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="font-lora truncate font-semibold">
							{'merkato.chat'}
						</span>
					</div>
				</SidebarMenuItem>
			</SidebarMenu> */}
			<Button
				variant={'blue'}
				size={'base'}
				className="font-ibm-plex-mono p-5"
				asChild
			>
				<a href="/chat">
					<span>New Chat</span>
					<Kbd className="h-5 max-w-max rounded-xs px-1.5 flex items-center gap-0.5 text-[.6875rem] font-bold text-gray-500 dark:text-gray-300 dark:border-offgray-400/10 border  dark:bg-cream-900/10   sm:flex !border-white/20 !bg-white/10 !text-white">
						<KbdKey aria-label="Meta">⌘</KbdKey>
						<KbdKey>N</KbdKey>
					</Kbd>
				</a>
			</Button>
		</SidebarHeader>
	)
}
