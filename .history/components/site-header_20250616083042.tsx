import { Sparkles } from 'lucide-react'
import { ModeSwitcher } from '@/components/mode-switcher'

export const SiteHeader = () => {
	return (
		<header className="relative w-full px-2 py-2 md:px-16 flex items-center border-b border-blue-200/80 dark:border-blue-300/10 border-dashed hover:border-solid bg-gradient-to-r from-transparent via-blue-100/40 to-transparent hover:bg-blue-50 dark:from-transparent dark:via-blue-600/10 dark:to-transparent dark:hover:bg-blue-700/10 fv-style transition-colors">
			<div className="flex-1 flex items-center justify-center min-w-0">
				<div className="flex items-center gap-1 font-ibm-plex-mono min-w-0">
					<Sparkles className="icons-base flex-shrink-0" size={24} />
					<span className="text-accent-blue text-sm dark:text-blue-100 truncate">
						Introducing:{' '}
						<span className="font-lora font-semibold tracking-wide">
							Agentic Editing
						</span>{' '}
						→
					</span>
				</div>
			</div>

			<div className="ml-2 flex-shrink-0">
				<ModeSwitcher />
			</div>

			<div className="absolute z-10 size-2 rotate-45 rounded-[1px] border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black bottom-[-4.5px] left-0" />
			<div className="absolute z-10 size-2 rotate-45 rounded-[1px] border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black bottom-[-4.5px] right-0" />
		</header>
	)
}
