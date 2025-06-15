import { Outlet } from 'react-router'
import { SidebarProvider } from './animate-ui/radix/sidebar'
import { ChatSidebar, StyledSection } from './chat-sidebar'
import { Banner } from './chat-sidebar'

export default function ChatLayout() {
	return (
		<SidebarProvider>
			<ChatSidebar />
			<div className="flex-1 relative">
				{/* {/* <Banner /> */}
				<StyledSection>
					<Outlet />
				</StyledSection> */}
				<Outlet />
			</div>
		</SidebarProvider>
	)
}
