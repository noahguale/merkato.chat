import { Outlet } from 'react-router'
import { SidebarProvider } from './animate-ui/radix/sidebar'
import { ChatSidebar } from './chat-sidebar'

export default function ChatLayout() {
	return (
		<SidebarProvider>
			<ChatSidebar />
			<div className="flex-1 relative">
				<Outlet />
			</div>
		</SidebarProvider>
	)
}
