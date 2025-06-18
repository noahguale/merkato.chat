export default {
	providers: [
		{
			domain:
				process.env.CONVEX_SITE_URL ||
				(process.env.VERCEL_URL
					? `https://${process.env.VERCEL_URL}`
					: 'http://localhost:3000'),
			applicationID: 'convex',
		},
	],
}
