import Google from '@auth/core/providers/google'

export default {
	providers: [
		{
			domain: process.env.CONVEX_SITE_URL,
			applicationID: 'convex',
		},
	],
}
