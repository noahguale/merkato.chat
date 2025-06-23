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
		<SidebarHeader className="flex w-full items-center justify-center">
			<SidebarMenu>
				<SidebarMenuItem className="flex w-full items-center">
					<SidebarTrigger className="-ml-1" />

					<SidebarMenuButton
						size="lg"
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="font-lora truncate font-semibold">
								{'merkato.chat'}
							</span>
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
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
