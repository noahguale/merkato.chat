export type ModelConfig = {
	id: string
	name: string
	provider: string
	description?: string
}

export type ProviderConfig = {
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
	providerSpecificConfig?: Record<string, unknown>
	isDefault: boolean
}
