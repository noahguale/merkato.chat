import { Outlet } from 'react-router'
import { SidebarProvider } from './animate/radix/sidebar'
import { ChatSidebar } from './chat-sidebar'
import { Banner } from './banner'
import { StyledBackground, StyledSection } from './background'
import { ModeSwitcher } from './mode-switcher'

export default function ChatLayout() {
	return (
		<SidebarProvider>
			<StyledBackground />
			<ChatSidebar />
			<div className="flex-1 relative">
				<Banner />
				<ModeSwitcher />
				<StyledSection>
					<Outlet />
				</StyledSection>
			</div>
		</SidebarProvider>
	)
}
