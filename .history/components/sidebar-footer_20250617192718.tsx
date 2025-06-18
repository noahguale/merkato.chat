import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuGroup,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ChevronsUpDown } from 'lucide-react'
import { Sparkles, BadgeCheck, CreditCard, Bell } from 'lucide-react'
import { useQuery } from 'convex/react'

import {
	SidebarFooter,
	SidebarMenuItem,
	SidebarMenu,
	SidebarMenuButton,
} from './animate-ui/radix/sidebar'

import { SignOut } from './sign-out'
import { api } from '@/convex/_generated/api'
import { LogOut } from './animate-ui/icons/log-out'

interface SideFooterProps {
	isMobile: boolean
}

export const SideFooter = ({ isMobile }: SideFooterProps) => {
	const user = useQuery(api.users.getCurrentUser)

	// Show loading state while user data is being fetched
	if (user === undefined) {
		return (
			<SidebarFooter className="group-data-[collapsible=icon]:p-2">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" disabled>
							<Avatar className="h-8 w-8 rounded-lg group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6">
								<AvatarFallback className="rounded-lg group-data-[collapsible=icon]:text-xs animate-pulse">
									...
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
								<span className="truncate font-semibold animate-pulse bg-gray-200 h-4 w-16 rounded"></span>
								<span className="truncate text-xs animate-pulse bg-gray-200 h-3 w-24 rounded mt-1"></span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		)
	}

	if (user === null) {
		return null
	}

	const getInitials = (name: string) => {
		return (
			name
				.split(' ')
				.map((word) => word.charAt(0))
				.join('')
				.toUpperCase()
				.slice(0, 2) || 'U'
		)
	}

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
									<AvatarImage src={user.image} alt={user.name} />
									<AvatarFallback className="rounded-lg group-data-[collapsible=icon]:text-xs">
										{getInitials(user.name)}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
									<span className="truncate font-semibold">{user.name}</span>
									<span className="truncate text-xs">{user.email}</span>
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
										<AvatarImage src={user.image} alt={user.name} />
										<AvatarFallback className="rounded-lg">
											{getInitials(user.name)}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">{user.name}</span>
										<span className="truncate text-xs">{user.email}</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem disabled className="cursor-not-allowed">
									<Sparkles />
									Upgrade to Pro
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem disabled className="cursor-not-allowed">
									<BadgeCheck />
									Account
								</DropdownMenuItem>
								<DropdownMenuItem disabled className="cursor-not-allowed">
									<CreditCard />
									Billing
								</DropdownMenuItem>
								<DropdownMenuItem disabled className="cursor-not-allowed">
									<Bell />
									Notifications
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<LogOut animateOnHover />
								<SignOut />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	)
}
