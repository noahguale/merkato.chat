export default {
	providers: [
		{
			domain: process.env.CONVEX_SITE_URL || process.env.VERCEL_URL,
			applicationID: 'convex',
		},
	],
}
