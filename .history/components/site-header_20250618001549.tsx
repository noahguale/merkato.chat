import { ModeSwitcher } from '@/components/mode-switcher'
import { KeyCommand } from './key-command'
import { GlobalThreadMenu } from './thread-menu'

export const SiteHeader = () => {
	return (
		<header className="sticky top-0 z-50 w-full px-2 py-2 md:px-16 group flex items-center  justify-between  border-b border-blue-200/80 dark:border-blue-300/10 border-dashed hover:border-solid bg-gradient-to-r from-transparent via-blue-100/40 to-transparent hover:bg-blue-50 dark:from-transparent dark:via-blue-600/10 dark:to-transparent dark:hover:bg-blue-700/10 fv-style transition-colors">
			<GlobalThreadMenu />

			<div className="flex items-center gap-4">
				<KeyCommand />
				<ModeSwitcher />
			</div>
			<div className="absolute z-10 size-2 rotate-45 rounded-[1px] border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black bottom-[-4.5px] left-[2px]" />
			<div className="absolute z-10 size-2 rotate-45 rounded-[1px] border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black bottom-[-4.5px] right-[2px]" />
		</header>
	)
}
