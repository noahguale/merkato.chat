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
import { applicationName } from '@/lib/config'

export const SideHeader = () => {
	return (
		<SidebarHeader className="p-4 space-y-4">
			<div className="flex items-center gap-3">
				<SidebarTrigger className="" />
				<a href="/chat" className="text-xl font-semibold font-ibm-plex-mono">
					merkato.chat
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

// const example = () => {
//     return (
// 			<SidebarHeader className="p-4 space-y-4">
// 				{/* Header with Trigger and Logo */}
// 				<div className="flex items-center gap-3">
// 					<SidebarTrigger className="text-pink-600 hover:bg-pink-200" />
// 					<h1 className="text-xl font-semibold text-pink-600">T3.chat</h1>
// 				</div>

// 				{/* New Chat Button */}
// 				<Button className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-xl py-6 text-base font-medium">
// 					<Plus className="w-4 h-4 mr-2" />
// 					New Chat
// 				</Button>

// 				{/* Search Input */}
// 				<div className="relative">
// 					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-400" />
// 					<SidebarInput
// 						placeholder="Search your threads..."
// 						className="pl-10 bg-transparent border-pink-300 placeholder:text-pink-400 text-pink-700 focus:border-pink-500"
// 					/>
// 				</div>
// 			</SidebarHeader>
// 		)
// }
