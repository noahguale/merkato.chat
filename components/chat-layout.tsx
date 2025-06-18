import { Outlet } from 'react-router'
import { SidebarProvider } from './animate-ui/radix/sidebar'
import { ChatSidebar } from './chat-sidebar'
import { StyledBackground, StyledSection } from './background'
import { SiteHeader } from './site-header'
import { ThreadSearchProvider } from '@/contexts/thread-search-context'

export default function ChatLayout() {
	return (
		<ThreadSearchProvider>
			<SidebarProvider>
				<StyledBackground />
				<ChatSidebar />
				<div className="flex-1 relative">
					<SiteHeader />
					<StyledSection>
						<Outlet />
					</StyledSection>
				</div>
			</SidebarProvider>
		</ThreadSearchProvider>
	)
}
