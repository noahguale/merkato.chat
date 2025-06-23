import { Sparkles } from 'lucide-react'

export const Banner = () => {
	return (
		<div className="relative w-full px-2 py-2 md:px-16 group flex items-center border-b border-blue-200/80 dark:border-blue-300/10 border-dashed hover:border-solid bg-linear-to-r from-transparent via-blue-100/40 to-transparent hover:bg-blue-50 dark:from-transparent dark:via-blue-600/10 dark:to-transparent dark:hover:bg-blue-700/10 fv-style transition-colors">
			<div className="relative mx-auto flex max-w-sm items-center gap-4 ">
				<div className="flex items-center gap-1 font-ibm-plex-mono">
					<Sparkles className="icons-base" size={24} />
					<span className="text-accent-blue text-sm dark:text-blue-100">
						Introducing:{' '}
						<span className="font-lora font-semibold tracking-wide">
							Agentic Editing
						</span>{' '}
						→
					</span>
				</div>
			</div>

			{/* Noise background */}
			{/* <div
				style={{
					backgroundImage: 'url(/_next/static/media/noise.0e24d0e5.png)',
				}}
				className="pointer-events-none [z-index:-1] absolute inset-0 bg-[size:180px] bg-repeat opacity-[0.035] dark:opacity-[0.015]"
			/> */}

			{/* Corner decorations */}
			<div className="absolute z-10 size-2 rotate-45 rounded-[1px] border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black bottom-[-4.5px] left-0" />
			<div className="absolute z-10 size-2 rotate-45 rounded-[1px] border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black bottom-[-4.5px] right-0" />
		</div>
	)
}
