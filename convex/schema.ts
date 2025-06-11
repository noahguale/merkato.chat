import { defineSchema, defineTable } from 'convex/server'
import { authTables } from '@convex-dev/auth/server'
import { v } from 'convex/values'

export const ProviderMetadataValidator = v.optional(
	v.record(v.string(), v.any())
)

export const MessageStatusValidator = v.union(
	v.literal('waiting'),
	v.literal('thinking'),
	v.literal('streaming'),
	v.literal('done'),
	v.literal('error'),
	v.literal('error.rejected'),
	v.literal('deleted')
)

const schema = defineSchema({
	...authTables,
	threads: defineTable({
		userId: v.id('users'),
		title: v.string(),
		createdAt: v.number(),
		updatedAt: v.number(),
		visibility: v.union(v.literal('visible'), v.literal('archived')),
		model: v.string(),
		pinned: v.boolean(),
		branchParentThreadId: v.optional(v.id('threads')),
		branchParentPublicMessageId: v.optional(v.string()),
		generationStatus: v.union(
			v.literal('pending'),
			v.literal('generating'),
			v.literal('completed'),
			v.literal('failed')
		),
	})
		.index('by_user', ['userId'])
		.index('by_userId_and_updatedAt', ['userId', 'updatedAt'])
		.index('by_user_and_pinned', ['userId', 'pinned'])
		.searchIndex('search_title', {
			searchField: 'title',
			filterFields: ['userId'],
		}),
	messages: defineTable({
		userId: v.id('users'),
		threadId: v.id('threads'),
		reasoning: v.optional(v.string()),
		content: v.string(),
		status: MessageStatusValidator,
		updatedAt: v.optional(v.number()),
		branches: v.optional(v.array(v.id('threads'))),
		role: v.union(
			v.literal('user'),
			v.literal('assistant'),
			v.literal('system')
		),
		createdAt: v.number(),
		serverError: v.optional(
			v.object({
				type: v.string(),
				message: v.string(),
			})
		),
		model: v.string(),
		attachmentIds: v.array(v.id('attachments')),
		modelParams: v.optional(
			v.object({
				temperature: v.optional(v.number()),
				topP: v.optional(v.number()),
				topK: v.optional(v.number()),
				reasoningEffort: v.optional(
					v.union(v.literal('low'), v.literal('medium'), v.literal('high'))
				),
				includeSearch: v.optional(v.boolean()),
			})
		),
		backfill: v.optional(v.boolean()),
		providerMetadata: ProviderMetadataValidator,
	})
		.index('by_threadId', ['threadId'])
		.index('by_thread_and_userid', ['threadId', 'userId'])
		.index('by_user', ['userId'])
		.index('by_threadId_and_createdAt', ['threadId', 'createdAt']),
	attachments: defineTable({
		messageIds: v.array(v.id('messages')),
		userId: v.id('users'),
		attachmentType: v.string(),
		attachmentUrl: v.string(),
		fileName: v.string(),
		mimeType: v.string(),
		fileSize: v.number(),
		fileKey: v.string(),
		backfill: v.optional(v.boolean()),
		status: v.optional(v.union(v.literal('deleted'), v.literal('uploaded'))),
	})
		.index('by_fileKey', ['fileKey'])
		.index('by_userId', ['userId'])
		.index('by_userId_and_fileKey', ['userId', 'fileKey']),
})

export default schema
