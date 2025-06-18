import { ModeSwitcher } from '@/components/mode-switcher'
import { KeyCommand } from './key-command'
import { GlobalThreadMenu } from './thread-menu'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/animate-ui/radix/tooltip'
import { Star } from './animate-ui/icons/star-icon'
import { AnimateIcon } from './animate-ui/icons/icon'
import { SidebarTrigger } from '@/components/animate-ui/radix/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'

export const SiteHeader = () => {
	const isMobile = useIsMobile()

	return (
		<TooltipProvider>
			<header className="sticky top-0 z-50 w-full px-2 py-2 md:px-16 group flex items-center justify-between border-b border-blue-200/80 dark:border-blue-300/10 border-dashed hover:border-solid bg-gradient-to-r from-transparent via-blue-100/40 to-transparent hover:bg-blue-50 dark:from-transparent dark:via-blue-600/10 dark:to-transparent dark:hover:bg-blue-700/10 fv-style transition-colors">
				{/* Mobile sidebar trigger */}
				<div className="hidden">
					<GlobalThreadMenu />
				</div>

				{isMobile && (
					<div className="flex md:hidden">
						<Tooltip>
							<TooltipTrigger asChild>
								<SidebarTrigger />
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>Toggle sidebar</p>
							</TooltipContent>
						</Tooltip>
					</div>
				)}

				<div className="relative mx-auto flex max-w-sm items-center gap-4">
					<div className="flex items-center gap-1 font-ibm-plex-mono">
						<AnimateIcon animate loop>
							<div>
								<Star size={12} className="	" />
							</div>
						</AnimateIcon>

						<span className="text-accent-blue text-sm dark:text-blue-100 whitespace-nowrap">
							Check out blog post:
							<span className="transition-transform duration-200 hover:translate-x-1 ml-1">
								→
							</span>
							<a
								href="https://www.guale.io/blog/merkato-chat"
								target="_blank"
								rel="noopener noreferrer"
								className="font-lora font-semibold tracking-wide hover:underline transition-all duration-200 inline-flex items-center gap-1 ml-1"
								aria-label="Read blog post about Merkato Chat (opens in new tab)"
							>
								guale.io
							</a>
						</span>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<Tooltip>
						<TooltipTrigger asChild>
							<div>
								<KeyCommand />
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<div className="flex items-center gap-2">
								Manage API Keys{' '}
								<kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
									<span className="text-xs">⌘</span>J
								</kbd>
							</div>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<div>
								<ModeSwitcher />
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Toggle theme</p>
						</TooltipContent>
					</Tooltip>
				</div>
				<div className="absolute z-10 size-2 rotate-45 rounded-[1px] border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black bottom-[-4.5px] left-[2px]" />
				<div className="absolute z-10 size-2 rotate-45 rounded-[1px] border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black bottom-[-4.5px] right-[2px]" />
			</header>
		</TooltipProvider>
	)
}
