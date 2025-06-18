export const StyledBackground = () => {
	return (
		<div className="fixed inset-0 -z-50 pointer-events-none" aria-hidden="true">
			<div className="absolute inset-0 bg-gradient-to-t from-blue-100/20 dark:from-blue-900/5" />

			<div className="absolute z-10 size-2 rotate-45 rounded-[1px] border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black bottom-[-4.5px] left-0" />
			<div className="absolute z-10 size-2 rotate-45 rounded-[1px] border border-blue-200 dark:border-blue-300/25 bg-white dark:bg-black bottom-[-4.5px] right-0" />

			<svg className="absolute inset-0 size-full fill-blue-500/50 stroke-blue-500/50 [mask-image:linear-gradient(to_top,_#ffffffad,_transparent)] opacity-30">
				<defs>
					<pattern
						id="grid-pattern"
						width="20"
						height="20"
						patternUnits="userSpaceOnUse"
						x="-1"
						y="-1"
					>
						<path d="M.5 20V.5H20" fill="none" strokeDasharray="0" />
					</pattern>
				</defs>
				<rect
					width="100%"
					height="100%"
					strokeWidth="0"
					fill="url(#grid-pattern)"
				/>
			</svg>
		</div>
	)
}

export const StyledSection = ({ children }: { children: React.ReactNode }) => {
	return <section className="relative  px-4 sm:px-6">{children}</section>
}
