import Google from '@auth/core/providers/google'

export default {
	providers: [
		// {
		// 	domain: process.env.CONVEX_SITE_URL || process.env.VERCEL_URL,
		// 	applicationID: 'convex',
		// },
		Google({
			clientId: process.env.AUTH_GOOGLE_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET,
		}),
	],
}
