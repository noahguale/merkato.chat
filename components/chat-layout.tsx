import { Outlet } from 'react-router'
import { SidebarProvider } from './animate-ui/radix/sidebar'
import { ChatSidebar } from './chat-sidebar'
import { Banner } from './banner'
import { StyledBackground, StyledSection } from './background'

export default function ChatLayout() {
	return (
		<SidebarProvider>
			<StyledBackground />
			<ChatSidebar />
			<div className="flex-1 relative">
				<Banner />
				<StyledSection>
					<Outlet />
				</StyledSection>
			</div>
		</SidebarProvider>
	)
}
