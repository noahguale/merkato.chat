import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuGroup,
	DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { ChevronsUpDown } from 'lucide-react'
import { Sparkles, BadgeCheck, CreditCard, Bell } from 'lucide-react'

import {
	SidebarFooter,
	SidebarMenuItem,
	SidebarMenu,
	SidebarMenuButton,
	useSidebar,
} from './animate-ui/radix/sidebar'

import { SignOut } from './sign-out'

const USER_DATA = {
	name: 'User',
	email: 'user@example.com',
	avatar: '',
}

interface SideFooterProps {
	isMobile: boolean
}

export const SideFooter = ({ isMobile }: SideFooterProps) => {
	const { state } = useSidebar()

	return (
		<SidebarFooter className="group-data-[collapsible=icon]:p-2">
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
							>
								<Avatar className="h-8 w-8 rounded-lg group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6">
									<AvatarImage src={USER_DATA.avatar} alt={USER_DATA.name} />
									<AvatarFallback className="rounded-lg group-data-[collapsible=icon]:text-xs">U</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
									<span className="truncate font-semibold">
										{USER_DATA.name}
									</span>
									<span className="truncate text-xs">{USER_DATA.email}</span>
								</div>
								<ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
							side={isMobile ? 'bottom' : 'right'}
							align="end"
							sideOffset={4}
						>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage src={USER_DATA.avatar} alt={USER_DATA.name} />
										<AvatarFallback className="rounded-lg">U</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											{USER_DATA.name}
										</span>
										<span className="truncate text-xs">{USER_DATA.email}</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<Sparkles />
									Upgrade to Pro
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<BadgeCheck />
									Account
								</DropdownMenuItem>
								<DropdownMenuItem>
									<CreditCard />
									Billing
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Bell />
									Notifications
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<SignOut />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	)
}
