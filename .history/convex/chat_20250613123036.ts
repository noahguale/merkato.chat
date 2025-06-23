import { getAuthUserId } from '@convex-dev/auth/server'
import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const createThread = mutation({
	args: {},
	handler: async (_, args) => {
		const userId = await getAuthUserId(_)
		if (!userId) {
			throw new Error('Unauthorized')
		}

		await _.db.insert('threads', {
			userId,
			title: '',
			createdAt: Date.now(),
			updatedAt: Date.now(),
			visibility: 'visible',
			model: '',
			pinned: false,
			generationStatus: 'pending',
		})
	},
})

export const createMessage = mutation({
	args: {
		threadId: v.optional(v.id('threads')), // Make this optional
		content: v.string(),
		role: v.union(
			v.literal('user'),
			v.literal('assistant'),
			v.literal('system')
		),
		model: v.string(),
	},
	handler: async (_, args) => {
		const userId = await getAuthUserId(_)
		if (!userId) {
			throw new Error('Unauthorized')
		}

		await _.db.insert('messages', {
			userId,
			createdAt: Date.now(),
			model: args.model,
			status: 'waiting',
			threadId: args.threadId, // This can now be undefined
			content: args.content,
			role: args.role,
			attachmentIds: [],
		})
	},
})
