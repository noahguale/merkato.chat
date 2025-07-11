import type { Doc } from '../convex/_generated/dataModel'
import type { WithoutSystemFields } from 'convex/server'

export type ModelConfig = {
	id: string
	name: string
	provider: string
	description?: string
}

export type ProviderConfig = WithoutSystemFields<Doc<'providerConfig'>>
export type Thread = WithoutSystemFields<Doc<'threads'>>
export type Message = WithoutSystemFields<Doc<'messages'>>

export const models = [
	'Deepseek R1',
	'Deepseek v3',
	'Gemini 2.5 Pro',
	'Gemini 2.5 Flash',
	'GPT-4o',
	'GPT-4.1-mini',
	'Claude Sonnet 4',
	'Claude 3.5 Sonnet',
	'Claude 3.7 Sonnet',
] as const

export const providers = [
	'openai',
	'google',
	'anthropic',
	'openrouter',
] as const

export const MODEL_CONFIGS: ModelConfig[] = [
	{
		id: 'deepseek/deepseek-r1-0528:free',
		name: 'Deepseek R1',
		provider: 'openrouter',
		description:
			'Advanced reasoning model with strong mathematical and coding capabilities',
	},
	{
		id: 'deepseek/deepseek-v3:free',
		name: 'Deepseek v3',
		provider: 'openrouter',
		description: 'Fast and efficient model for general-purpose tasks',
	},
	{
		id: 'gemini-2.5-pro',
		name: 'Gemini 2.5 Pro',
		provider: 'google',
		description: "Google's most capable model with multimodal capabilities",
	},
	{
		id: 'gemini-2.5-flash',
		name: 'Gemini 2.5 Flash',
		provider: 'google',
		description: 'Fast and lightweight model optimized for speed',
	},
	{
		id: 'gpt-4o',
		name: 'GPT-4o',
		provider: 'openai',
		description:
			"OpenAI's flagship model with vision and multimodal capabilities",
	},
	{
		id: 'gpt-4o-mini',
		name: 'GPT-4.1-mini',
		provider: 'openai',
		description:
			'Smaller, faster version of GPT-4o for cost-effective applications',
	},
	{
		id: 'claude-sonnet-4-20250514',
		name: 'Claude Sonnet 4',
		provider: 'anthropic',
		description:
			'Latest Claude model with enhanced reasoning and coding abilities',
	},
	{
		id: 'claude-3-5-sonnet-20241022',
		name: 'Claude 3.5 Sonnet',
		provider: 'anthropic',
		description:
			'Balanced model excellent for writing, analysis, and coding tasks',
	},
	{
		id: 'claude-3-5-sonnet-20241022',
		name: 'Claude 3.7 Sonnet',
		provider: 'anthropic',
		description:
			'Balanced model excellent for writing, analysis, and coding tasks',
	},
]
