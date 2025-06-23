import { Outlet } from 'react-router'
import { SidebarProvider } from './animate-ui/radix/sidebar'
import { ChatSidebar } from './chat-sidebar'

export default function ChatLayout() {
	return (
		<div>
			<Outlet />
		</div>
	)
}
