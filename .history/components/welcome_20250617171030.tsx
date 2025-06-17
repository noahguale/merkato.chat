export const Welcome = () => {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-2">
			<h1 className="font-lora text-pretty scroll-mt-24 h0 text-accent-blue dark:text-blue-300 font-normal text-center">
				Welcome, {user.name}. How can I help you today?
			</h1>
			<p className="tracking-tight text-center max-w-lg text-pretty">
				merkato is a next-generation code editor designed for{' '}
				<span className="whitespace-nowrap">high-performance</span>{' '}
				collaboration with humans and AI.
			</p>
		</div>
	)
}
