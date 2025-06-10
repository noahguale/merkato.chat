import { defineSchema, defineTable } from 'convex/server'
import { authTables } from '@convex-dev/auth/server'
import { v } from 'convex/values'

export const ThreadMetadataValidator = v.object({
	totalTokenUsage: v.optional(
		v.object({
			promptTokens: v.number(),
			completionTokens: v.number(),
			totalTokens: v.number(),
		})
	),
	averageResponseTime: v.optional(v.number()),
	modelUsageStats: v.optional(v.record(v.string(), v.number())), // model -> usage count
	totalMessages: v.optional(v.number()),
	lastGenerationDuration: v.optional(v.number()),
	generationParameters: v.optional(
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
})

export const ChatStoreConfigValidator = v.object({
	maxSteps: v.optional(v.number()),
	activeTools: v.optional(v.array(v.string())),
	stopConditions: v.optional(v.array(v.string())),
	experimental_prepareStep: v.optional(v.boolean()),
})

export const MessageMetadataValidator = v.object({
	duration: v.optional(v.number()),
	tokenUsage: v.optional(
		v.object({
			promptTokens: v.number(),
			completionTokens: v.number(),
			totalTokens: v.number(),
		})
	),
	modelId: v.optional(v.string()),
	temperature: v.optional(v.number()),
	topP: v.optional(v.number()),
	topK: v.optional(v.number()),
	stepCount: v.optional(v.number()),
	finishReason: v.optional(
		v.union(
			v.literal('stop'),
			v.literal('length'),
			v.literal('content_filter'),
			v.literal('tool_calls'),
			v.literal('error')
		)
	),
})

export const TextPartValidator = v.object({
	type: v.literal('text'),
	text: v.string(),
})

export const ImagePartValidator = v.object({
	type: v.literal('image'),
	image: v.union(
		v.object({
			type: v.literal('base64'),
			data: v.string(),
			mimeType: v.string(),
		}),
		v.object({
			type: v.literal('url'),
			url: v.string(),
		})
	),
})

export const ToolCallPartValidator = v.object({
	type: v.literal('tool-call'),
	toolCallId: v.string(),
	toolName: v.string(),
	args: v.any(),
})

export const ToolResultPartValidator = v.object({
	type: v.literal('tool-result'),
	toolCallId: v.string(),
	toolName: v.string(),
	result: v.any(),
	isError: v.optional(v.boolean()),
})

export const ReasoningPartValidator = v.object({
	type: v.literal('reasoning'),
	reasoning: v.string(),
})

export const SourcePartValidator = v.object({
	type: v.literal('source'),
	value: v.object({
		type: v.literal('source'),
		sourceType: v.union(
			v.literal('url'),
			v.literal('document'),
			v.literal('knowledge')
		),
		id: v.string(),
		url: v.optional(v.string()),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
	}),
})

export const DataPartValidator = v.object({
	type: v.string(),
	id: v.optional(v.string()),
	data: v.any(),
})

export const ContentPartValidator = v.union(
	TextPartValidator,
	ImagePartValidator,
	ToolCallPartValidator,
	ToolResultPartValidator,
	ReasoningPartValidator,
	SourcePartValidator,
	DataPartValidator
)

export const MessageStatusValidator = v.union(
	v.literal('pending'),
	v.literal('streaming'),
	v.literal('completed'),
	v.literal('error'),
	v.literal('cancelled')
)

export const ProcessingStatusValidator = v.union(
	v.literal('uploaded'),
	v.literal('scanning'),
	v.literal('processing'),
	v.literal('vectorizing'),
	v.literal('ready'),
	v.literal('error'),
	v.literal('deleted')
)

export const ProcessingStepValidator = v.object({
	step: v.union(
		v.literal('upload'),
		v.literal('virus_scan'),
		v.literal('content_extraction'),
		v.literal('thumbnail_generation'),
		v.literal('compression'),
		v.literal('vectorization'),
		v.literal('ai_preparation')
	),
	status: v.union(
		v.literal('pending'),
		v.literal('completed'),
		v.literal('failed')
	),
	completedAt: v.optional(v.number()),
	error: v.optional(v.string()),
})

export const AIMetadataValidator = v.object({
	extractedText: v.optional(v.string()),
	tokenEstimate: v.optional(v.number()),
	modelCompatibility: v.array(v.string()),
	processingCost: v.optional(v.number()),
	contentPartType: v.union(
		v.literal('image'),
		v.literal('document'),
		v.literal('audio'),
		v.literal('video'),
		v.literal('data')
	),
	vectorEmbeddings: v.optional(v.array(v.number())),
	semanticMetadata: v.optional(
		v.object({
			topics: v.optional(v.array(v.string())),
			entities: v.optional(v.array(v.string())),
			summary: v.optional(v.string()),
		})
	),
})

export const ImageMetadataValidator = v.object({
	width: v.number(),
	height: v.number(),
	format: v.string(),
	colorSpace: v.optional(v.string()),
	hasAlpha: v.optional(v.boolean()),
})

export const CompressionInfoValidator = v.object({
	originalSize: v.number(),
	compressedSize: v.number(),
	compressionRatio: v.number(),
	algorithm: v.string(),
	quality: v.optional(v.number()),
})

export const APIKeyStatusValidator = v.union(
	v.literal('active'),
	v.literal('inactive'),
	v.literal('expired'),
	v.literal('invalid'),
	v.literal('quota_exceeded'),
	v.literal('suspended')
)

export const ProviderValidator = v.union(
	v.literal('google'),
	v.literal('openai'),
	v.literal('openrouter')
)

export const UsageStatsValidator = v.object({
	totalRequests: v.number(),
	totalTokens: v.optional(v.number()),
	totalCost: v.optional(v.number()),
	lastMonthRequests: v.optional(v.number()),
	lastMonthTokens: v.optional(v.number()),
	lastMonthCost: v.optional(v.number()),
	errorCount: v.optional(v.number()),
	averageResponseTime: v.optional(v.number()),
})

export const RateLimitConfigValidator = v.object({
	requestsPerMinute: v.optional(v.number()),
	requestsPerDay: v.optional(v.number()),
	tokensPerDay: v.optional(v.number()),
	costLimitPerMonth: v.optional(v.number()),
})

export const ValidationInfoValidator = v.object({
	lastValidated: v.optional(v.number()),
	validationStatus: v.union(
		v.literal('valid'),
		v.literal('invalid'),
		v.literal('pending'),
		v.literal('error')
	),
	validationError: v.optional(v.string()),
	supportedModels: v.optional(v.array(v.string())),
	accountInfo: v.optional(
		v.object({
			organizationId: v.optional(v.string()),
			accountType: v.optional(v.string()),
			quotaLimits: v.optional(v.record(v.string(), v.number())),
		})
	),
})

const schema = defineSchema({
	...authTables,
	threads: defineTable({
		userId: v.id('users'),
		title: v.string(),
		createdAt: v.number(),
		updatedAt: v.number(),
		visibility: v.union(v.literal('visible'), v.literal('archived')),

		// Model configuration for AI SDK v5
		model: v.string(), // Primary/default model
		allowModelSwitching: v.boolean(),
		modelsUsed: v.array(v.string()), // Track all models used in this thread

		pinned: v.boolean(),

		// Thread-level branching support
		branchParentThreadId: v.optional(v.id('threads')),
		branchParentPublicMessageId: v.optional(v.string()),
		branchingEnabled: v.boolean(),
		maxBranches: v.number(),
		branchLevel: v.optional(v.number()),

		generationStatus: v.union(
			v.literal('pending'),
			v.literal('generating'),
			v.literal('completed'),
			v.literal('failed')
		),

		chatStoreConfig: v.optional(ChatStoreConfigValidator),
		metadata: v.optional(ThreadMetadataValidator),
	})
		.index('by_user', ['userId'])
		.index('by_userId_and_updatedAt', ['userId', 'updatedAt'])
		.index('by_user_and_pinned', ['userId', 'pinned'])
		.index('by_branch_parent', ['branchParentThreadId'])
		.index('by_user_and_branch_level', ['userId', 'branchLevel'])
		.searchIndex('search_title', {
			searchField: 'title',
			filterFields: ['userId'],
		}),
	messages: defineTable({
		userId: v.id('users'),
		threadId: v.id('threads'),
		role: v.union(
			v.literal('user'),
			v.literal('assistant'),
			v.literal('system')
		),
		parts: v.array(ContentPartValidator),
		metadata: v.optional(MessageMetadataValidator),
		status: MessageStatusValidator,
		createdAt: v.number(),
		updatedAt: v.optional(v.number()),
		serverError: v.optional(
			v.object({
				type: v.string(),
				message: v.string(),
				stack: v.optional(v.string()),
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
		providerMetadata: v.optional(v.record(v.string(), v.any())),
		branches: v.optional(v.array(v.id('threads'))),
		branchParentMessageId: v.optional(v.id('messages')),
		branchIndex: v.optional(v.number()),
	})
		.index('by_threadId', ['threadId'])
		.index('by_thread_and_userid', ['threadId', 'userId'])
		.index('by_user', ['userId'])
		.index('by_branch_parent', ['branchParentMessageId']),
	attachments: defineTable({
		publicMessageIds: v.array(v.id('messages')),
		userId: v.id('users'),
		fileName: v.string(),
		mimeType: v.string(),
		fileSize: v.number(),
		fileKey: v.string(),

		attachmentType: v.string(),
		attachmentUrl: v.string(),
		thumbnailUrl: v.optional(v.string()),
		dimensions: v.optional(ImageMetadataValidator),

		processingStatus: ProcessingStatusValidator,
		processingSteps: v.array(ProcessingStepValidator),
		aiCompatible: v.boolean(),
		compressionInfo: v.optional(CompressionInfoValidator),

		accessLevel: v.union(
			v.literal('public'),
			v.literal('private'),
			v.literal('shared')
		),
		expiresAt: v.optional(v.number()),
		checksums: v.object({
			md5: v.optional(v.string()),
			sha256: v.optional(v.string()),
		}),

		aiMetadata: v.optional(AIMetadataValidator),

		backfill: v.optional(v.boolean()),
		status: v.optional(v.union(v.literal('deleted'), v.literal('uploaded'))),

		createdAt: v.optional(v.number()),
		updatedAt: v.optional(v.number()),
	})
		.index('by_fileKey', ['fileKey'])
		.index('by_userId', ['userId'])
		.index('by_userId_and_fileKey', ['userId', 'fileKey'])
		.index('by_processing_status', ['processingStatus'])
		.index('by_user_and_processing_status', ['userId', 'processingStatus'])
		.index('by_ai_compatible', ['aiCompatible'])
		.index('by_access_level', ['accessLevel'])
		.index('by_content_part_type', ['aiMetadata.contentPartType'])
		.index('by_expires_at', ['expiresAt']),
	apiKeys: defineTable({
		userId: v.id('users'),
		provider: ProviderValidator,

		encryptedKey: v.string(),
		keyHash: v.string(),
		keyName: v.optional(v.string()),
		keyPrefix: v.optional(v.string()),

		status: APIKeyStatusValidator,
		isActive: v.boolean(),
		isPrimary: v.boolean(),

		usageStats: v.optional(UsageStatsValidator),
		rateLimitConfig: v.optional(RateLimitConfigValidator),
		usageQuota: v.optional(v.number()),
		usageCount: v.optional(v.number()),

		validationInfo: v.optional(ValidationInfoValidator),

		createdAt: v.number(),
		updatedAt: v.optional(v.number()),
		lastUsedAt: v.optional(v.number()),
		lastValidatedAt: v.optional(v.number()),
		expiresAt: v.optional(v.number()),

		accessLevel: v.union(
			v.literal('full'),
			v.literal('limited'),
			v.literal('readonly')
		),
		allowedModels: v.optional(v.array(v.string())),
		notes: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
	})
		.index('by_userId', ['userId'])
		.index('by_user_and_provider', ['userId', 'provider'])
		.index('by_user_provider_active', ['userId', 'provider', 'isActive'])
		.index('by_user_and_primary', ['userId', 'isPrimary'])
		.index('by_key_hash', ['keyHash'])
		.index('by_status', ['status'])
		.index('by_expires_at', ['expiresAt'])
		.index('by_last_used', ['lastUsedAt']),
})

export default schema
