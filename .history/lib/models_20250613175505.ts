import { Doc } from 'convex/server'

export type ModelConfig = {
	id: string
	name: string
	provider: string
	description?: string
}

export type ProviderConfig = Doc<'providerConfig'>
