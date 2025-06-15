import { getAuthUserId } from '@convex-dev/auth/server'
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const getThread = query({
	args: { threadId: v.id('threads') },
	handler: async (_, args) => {
		const userId = await getAuthUserId(_)
		if (!userId) {
			throw new Error('Unauthorized')
		}

		const thread = await _.db.get(args.threadId)

		if (!thread) {
			return null
		}

		if (thread.userId !== userId) {
			console.error('User attempted to access thread they do not own', {
				userId,
				threadId: args.threadId,
				threadOwnerId: thread.userId,
			})
			return null
		}

		return thread
	},
})

export const createMessage = mutation({
	args: {
		threadId: v.optional(v.id('threads')),
		content: v.string(),
		role: v.union(v.literal('user'), v.literal('assistant')),
		model: v.string(),
	},
	handler: async (_, args) => {
		const userId = await getAuthUserId(_)
		if (!userId) {
			throw new Error('Unauthorized')
		}

		let threadId = args.threadId

		if (!threadId) {
			threadId = await _.db.insert('threads', {
				userId,
				title: '',
				createdAt: Date.now(),
				updatedAt: Date.now(),
				visibility: 'visible',
				model: args.model,
				pinned: false,
				generationStatus: 'pending',
			})
		}

		await _.db.insert('messages', {
			userId,
			createdAt: Date.now(),
			model: args.model,
			status: 'waiting',
			threadId,
			content: args.content,
			role: args.role,
			attachmentIds: [],
		})

		return threadId
	},
})

export const getThreads = query({
	args: {},
	handler: async (_) => {
		const userId = await getAuthUserId(_)
		if (!userId) {
			throw new Error('Unauthorized')
		}

		const threads = await _.db
			.query('threads')
			.withIndex('by_userId_and_updatedAt', (q) => q.eq('userId', userId))
			.order('desc')
			.collect()

		return threads.map((thread) => ({
			id: thread._id,
			title: thread.title,
			createdAt: thread.createdAt,
			updatedAt: thread.updatedAt,
			model: thread.model,
			pinned: thread.pinned,
		}))
	},
})

export const getMessages = query({
	args: { threadId: v.id('threads') },
	handler: async (_, args) => {
		const userId = await getAuthUserId(_)
		if (!userId) {
			throw new Error('Unauthorized')
		}

		const thread = await _.db.get(args.threadId)

		if (!thread || thread.userId !== userId) {
			return []
		}

		const messages = await _.db
			.query('messages')
			.withIndex('by_threadId', (q) => q.eq('threadId', args.threadId))
			.order('asc')
			.collect()

		return messages.map((msg) => ({
			id: msg._id,
			content: msg.content,
			role: msg.role,
			createdAt: msg.createdAt,
		}))
	},
})

export const updateThreadTitle = mutation({
	args: {
		threadId: v.id('threads'),
		title: v.string(),
	},
	handler: async (_, args) => {
		const userId = await getAuthUserId(_)
		if (!userId) throw new Error('Unauthorized')

		await _.db.patch(args.threadId, { title: args.title })
	},
})
