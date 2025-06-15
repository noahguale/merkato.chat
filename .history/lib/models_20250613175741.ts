import type { Doc } from '../convex/_generated/dataModel'

export type ModelConfig = {
	id: string
	name: string
	provider: string
	description?: string
}

export type ProviderConfig = Doc<'providerConfig'>
