export type ModelConfig = {
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
