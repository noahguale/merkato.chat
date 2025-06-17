import { Search } from 'lucide-react'
import {
	SidebarHeader,
	SidebarInput,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from './animate-ui/radix/sidebar'
import { Button } from './ui/button'
import { Kbd, KbdKey } from './ui/kdb'

export const SideHeader = () => {
	return (
		<SidebarHeader className="p-4 space-y-4">
			<div className="flex items-center gap-3">
				<SidebarTrigger className="" />
				<a href="/chat" className="text-xl font-semibold font-ibm-plex-mono">
					<span>merkato</span>
					<span className="text-blue-500">.chat</span>
				</a>
			</div>

			<Button
				variant={'blue'}
				size={'base'}
				className="font-ibm-plex-mono p-5"
				asChild
			>
				<a href="/chat">
					<span>New Chat</span>
					<Kbd className="h-5 max-w-max rounded-xs px-1.5 flex items-center gap-0.5 text-[.6875rem] font-bold  dark:text-gray-300 dark:border-offgray-400/10 border  dark:bg-cream-900/10   sm:flex !border-white/20 !bg-white/10 !text-white">
						<KbdKey aria-label="Meta">⌘</KbdKey>
						<KbdKey>N</KbdKey>
					</Kbd>
				</a>
			</Button>

			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-400" />
				<SidebarInput
					placeholder="Search your threads..."
					className="pl-10 bg-transparent "
				/>
			</div>
		</SidebarHeader>
	)
}
