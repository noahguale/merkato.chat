import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'

export const createStreamSession = mutation({
	args: {
		threadId: v.id('threads'),
		streamId: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)
		if (!userId) throw new Error('Unauthorized')

		return await ctx.db.insert('streamSessions', {
			userId,
			threadId: args.threadId,
			streamId: args.streamId,
			status: 'active',
			createdAt: Date.now(),
			lastActivity: Date.now(),
		})
	},
})

export const getActiveStreams = query({
	args: {
		threadId: v.id('threads'),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)
		if (!userId) throw new Error('Unauthorized')

		const streams = await ctx.db
			.query('streamSessions')
			.withIndex('by_thread', (q) => q.eq('threadId', args.threadId))
			.filter((q) => q.eq(q.field('userId'), userId))
			.order('desc')
			.collect()

		return streams.map((s) => s.streamId)
	},
})

export const updateStreamStatus = mutation({
	args: {
		streamId: v.string(),
		status: v.union(
			v.literal('active'),
			v.literal('completed'),
			v.literal('failed')
		),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)
		if (!userId) throw new Error('Unauthorized')

		const stream = await ctx.db
			.query('streamSessions')
			.withIndex('by_streamId', (q) => q.eq('streamId', args.streamId))
			.filter((q) => q.eq(q.field('userId'), userId))
			.first()

		if (stream) {
			await ctx.db.patch(stream._id, {
				status: args.status,
				lastActivity: Date.now(),
			})
		}
	},
})
