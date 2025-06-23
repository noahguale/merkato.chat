import { Outlet } from 'react-router'
import { SidebarProvider } from './animate-ui/radix/sidebar'
import { ChatSidebar } from './chat-sidebar'
import { StyledBackground, StyledSection } from './background'
import { SiteHeader } from './site-header'
import { KeyCommand } from './key-command'

export default function ChatLayout() {
	return (
		<SidebarProvider>
			<StyledBackground />
			<ChatSidebar />
			<div className="flex-1 relative">
				<SiteHeader />
				<StyledSection>
					<KeyCommand />
					<Outlet />
				</StyledSection>
			</div>
		</SidebarProvider>
	)
}
