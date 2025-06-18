import { mutation, query } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'

export const createAttachment = mutation({
	args: {
		fileName: v.string(),
		fileSize: v.number(),
		mimeType: v.string(),
		attachmentUrl: v.string(),
		messageIds: v.optional(v.array(v.id('messages'))),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)
		if (!userId) {
			throw new Error('Unauthorized')
		}

		const attachmentId = await ctx.db.insert('attachments', {
			userId,
			fileName: args.fileName,
			fileSize: args.fileSize,
			mimeType: args.mimeType,
			attachmentUrl: args.attachmentUrl,
			attachmentType: 'file', // Default type
			fileKey: `${Date.now()}-${args.fileName}`, // Generate a unique key
			messageIds: args.messageIds || [],
			status: 'uploaded',
		})

		return attachmentId
	},
})

export const getAttachment = query({
	args: { attachmentId: v.id('attachments') },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)
		if (!userId) {
			throw new Error('Unauthorized')
		}

		const attachment = await ctx.db.get(args.attachmentId)
		if (!attachment || attachment.userId !== userId) {
			return null
		}

		return attachment
	},
})

export const getUserAttachments = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx)
		if (!userId) {
			throw new Error('Unauthorized')
		}

		return await ctx.db
			.query('attachments')
			.withIndex('by_userId', (q) => q.eq('userId', userId))
			.order('desc')
			.collect()
	},
})

export const deleteAttachment = mutation({
	args: { attachmentId: v.id('attachments') },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)
		if (!userId) {
			throw new Error('Unauthorized')
		}

		const attachment = await ctx.db.get(args.attachmentId)
		if (!attachment || attachment.userId !== userId) {
			throw new Error('Attachment not found or unauthorized')
		}

		await ctx.db.delete(args.attachmentId)
	},
})