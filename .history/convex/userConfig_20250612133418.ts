import { getAuthUserId } from '@convex-dev/auth/server'
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const addProviderConfig = mutation({
	args: {
		provider: v.string(),
		encryptedApiKey: v.string(),
		keyPrefix: v.string(),
		displayName: v.optional(v.string()),
	},
	handler: async (_, args) => {
		const userId = await getAuthUserId(_)
		if (!userId) {
			throw new Error('Unauthorized')
		}

		return await _.db.insert('userConfig', {
			userId,
			provider: args.provider,
			displayName: args.displayName || `${args.provider} API Key`,
			encryptedApiKey: args.encryptedApiKey,
			keyPrefix: args.keyPrefix,
			status: 'active',
			createdAt: Date.now(),
			updatedAt: Date.now(),
			isDefault: true,
		})
	},
})

export const getProviderConfig = query({
	args: { provider: v.string() },
	handler: async (_, args) => {
		const userId = await getAuthUserId(_)
		if (!userId) {
			throw new Error('Unauthorized')
		}

		return await _.db
			.query('userConfig')
			.withIndex('by_user_and_provider', (q) =>
				q.eq('userId', userId).eq('provider', args.provider)
			)
			.filter((q) => q.eq(q.field('status'), 'active'))
			.first()
	},
})

export const getUserProviders = query({
	args: {},
	handler: async (_) => {
		const userId = await getAuthUserId(_)
		if (!userId) {
			return []
		}

		return await _.db
			.query('userConfig')
			.withIndex('by_user', (q) => q.eq('userId', userId))
			.collect()
	},
})
