import type { Doc } from '../convex/_generated/dataModel'
import type { WithoutSystemFields } from 'convex/server'

export type ModelConfig = {
	id: string
	name: string
	provider: string
	description?: string
}

export type ProviderConfig = WithoutSystemFields<Doc<'providerConfig'>>

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
