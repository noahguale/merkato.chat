import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface ModelDefinition {
	id: string
	name: string
	provider: string
	description?: string
	maxTokens?: number
	supportsVision?: boolean
	supportsFunctionCalling?: boolean
	costPer1kTokens?: {
		input: number
		output: number
	}
}

export interface ProviderConfig {
	_id: string
	_creationTime: number
	userId: string
	provider: string
	displayName?: string
	encryptedApiKey: string
	keyPrefix?: string
	status:
		| 'active'
		| 'invalid'
		| 'expired'
		| 'rate_limited'
		| 'pending_validation'
	lastValidated?: number
	validationError?: string
	createdAt: number
	updatedAt: number
	providerSpecificConfig?: Record<string, any>
	isDefault: boolean
}
export interface AIModelState {
	currentProvider: string | undefined
	currentModel: string | undefined
	availableProviders: ProviderConfig[]
	isLoading: boolean
	error: string | null

	setCurrentModel: (model: string) => void
	setAvailableProviders: (providers: ProviderConfig[]) => void
	setLoading: (loading: boolean) => void
	setError: (error: string | null) => void
	refreshProviders: () => Promise<void>

	getAvailableModels: () => ModelDefinition[]
	getProviderStatus: (provider: string) => 'available' | 'unavailable' | 'error'
	getCurrentModelInfo: () => ModelDefinition | null
}

export const MODEL_DEFINITIONS: ModelDefinition[] = [
	{
		id: 'gpt-4o',
		name: 'GPT-4o',
		provider: 'openai',
		description: 'Most capable model, great for complex tasks',
		maxTokens: 128000,
		supportsVision: true,
		supportsFunctionCalling: true,
		costPer1kTokens: { input: 2.5, output: 10 },
	},
	{
		id: 'gpt-4o-mini',
		name: 'GPT-4o Mini',
		provider: 'openai',
		description: 'Fast and efficient for most tasks',
		maxTokens: 128000,
		supportsVision: true,
		supportsFunctionCalling: true,
		costPer1kTokens: { input: 0.15, output: 0.6 },
	},
	{
		id: 'gpt-4-turbo',
		name: 'GPT-4 Turbo',
		provider: 'openai',
		description: 'Previous generation flagship model',
		maxTokens: 128000,
		supportsVision: true,
		supportsFunctionCalling: true,
		costPer1kTokens: { input: 10, output: 30 },
	},
	{
		id: 'gpt-3.5-turbo',
		name: 'GPT-3.5 Turbo',
		provider: 'openai',
		description: 'Fast and cost-effective',
		maxTokens: 16384,
		supportsVision: false,
		supportsFunctionCalling: true,
		costPer1kTokens: { input: 0.5, output: 1.5 },
	},

	{
		id: 'gemini-2.0-flash-exp',
		name: 'Gemini 2.0 Flash (Experimental)',
		provider: 'google',
		description: 'Latest experimental model with advanced capabilities',
		maxTokens: 1000000,
		supportsVision: true,
		supportsFunctionCalling: true,
		costPer1kTokens: { input: 0.075, output: 0.3 },
	},
	{
		id: 'gemini-1.5-pro',
		name: 'Gemini 1.5 Pro',
		provider: 'google',
		description: 'Most capable model with very large context',
		maxTokens: 2000000,
		supportsVision: true,
		supportsFunctionCalling: true,
		costPer1kTokens: { input: 1.25, output: 5 },
	},
	{
		id: 'gemini-1.5-flash',
		name: 'Gemini 1.5 Flash',
		provider: 'google',
		description: 'Fast and efficient with large context',
		maxTokens: 1000000,
		supportsVision: true,
		supportsFunctionCalling: true,
		costPer1kTokens: { input: 0.075, output: 0.3 },
	},

	{
		id: 'claude-3-5-sonnet-20241022',
		name: 'Claude 3.5 Sonnet',
		provider: 'anthropic',
		description: 'Most intelligent model, excellent for complex reasoning',
		maxTokens: 200000,
		supportsVision: true,
		supportsFunctionCalling: true,
		costPer1kTokens: { input: 3, output: 15 },
	},
	{
		id: 'deepseek/deepseek-chat',
		name: 'DeepSeek Chat',
		provider: 'openrouter',
		description: 'Competitive open source model',
		supportsFunctionCalling: true,
	},
]

export const useAIModelStore = create<AIModelState>()(
	devtools(
		(set, get) => ({
			// currentProvider: undefined,
			currentModel: undefined,
			availableProviders: [],
			isLoading: false,
			error: null,

			// setCurrentModel: (provider: string, model: string) => {
			// 	set({ currentProvider: provider, currentModel: model, error: null })
			// },

			setCurrentModel: (model: string) => {
				set({ currentModel: model, error: null })
			},

			setAvailableProviders: (providers: ProviderConfig[]) => {
				set({ availableProviders: providers })
			},

			setLoading: (loading: boolean) => {
				set({ isLoading: loading })
			},

			setError: (error: string | null) => {
				set({ error })
			},

			refreshProviders: async () => {
				set({ isLoading: true, error: null })
			},

			getAvailableModels: () => {
				const { availableProviders } = get()
				const activeProviders = availableProviders
					.filter((p) => p.status === 'active')
					.map((p) => p.provider)

				return MODEL_DEFINITIONS.filter((model) =>
					activeProviders.includes(model.provider)
				)
			},

			getProviderStatus: (provider: string) => {
				const { availableProviders } = get()
				const providerConfig = availableProviders.find(
					(p) => p.provider === provider
				)

				if (!providerConfig) return 'unavailable'
				if (providerConfig.status === 'active') return 'available'
				return 'error'
			},

			// getCurrentModelInfo: () => {
			// 	const { currentProvider, currentModel } = get()
			// 	if (!currentProvider || !currentModel) return null

			// 	return (
			// 		MODEL_DEFINITIONS.find(
			// 			(model) =>
			// 				model.provider === currentProvider && model.id === currentModel
			// 		) || null
			// 	)
			// },
			getCurrentModelInfo: () => {
				const { currentModel } = get()
				if (!currentModel) return null

				const [provider, modelId] = currentModel.split(':')
				return (
					MODEL_DEFINITIONS.find(
						(model) => model.provider === provider && model.id === modelId
					) || null
				)
			},
		}),
		{
			name: 'ai-model-store',
		}
	)
)
