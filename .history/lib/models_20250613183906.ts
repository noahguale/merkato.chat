import type { Doc } from '../convex/_generated/dataModel'
import type { WithoutSystemFields } from 'convex/server'

export type ModelConfig = {
	id: string
	name: string
	provider: string
	description?: string
}

export type ProviderConfig = WithoutSystemFields<Doc<'providerConfig'>>

export const modelIds: Record<string, string> = {
	'Deepseek R1': 'deepseek/deepseek-r1-0528:free',
	'Deepseek v3': 'deepseek/deepseek-v3:free',
	'Gemini 2.5 Pro': 'gemini-2.5-pro',
	'Gemini 2.5 Flash': 'gemini-2.5-flash',
	'GPT-4o': 'gpt-4o',
	'GPT-4.1-mini': 'gpt-4o-mini',
	'Claude Sonnet 4': 'claude-sonnet-4-20250514',
	'Claude 3.5 Sonnet': 'claude-3-5-sonnet-20241022',
	'Claude 3.7 Sonnet': 'claude-3-5-sonnet-20241022',
} as const

export const providers = [
	'openai',
	'google',
	'anthropic',
	'openrouter',
] as const

export const MODEL_CONFIGS: ModelConfig[] = [
	{
		id: 'Deepseek R1',
		name: 'Deepseek R1',
		provider: 'openai',
		description:
			'Deepseek R1 is a powerful model that can handle complex tasks.',
	},
	{
		id: 'Deepseek v3',
		name: 'Deepseek v3',
		provider: 'openai',
		description:
			'Deepseek v3 is a powerful model that can handle complex tasks.',
	},
]
