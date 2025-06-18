import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { AnthropicProviderOptions, createAnthropic } from '@ai-sdk/anthropic'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText, Message } from 'ai'
import { system } from '@/lib/prompt'
import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { decryptApiKey } from '@/lib/encryption'
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { api } from '@/convex/_generated/api'
import { getOpenRouterModelId } from '@/lib/types'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const providerCache = new Map<string, { apiKey: string; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export const maxDuration = 60

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: NextRequest) {
	try {
		const {
			messages,
			provider,
			model,
		}: {
			messages: Message[]
			provider: string
			model: string
		} = await req.json()
		if (!provider || !model) {
			return NextResponse.json(
				{
					error: '[ERROR]: Both provider and model are required',
				},
				{ status: 400 }
			)
		}
		const token = await convexAuthNextjsToken()
		if (!token) {
			return NextResponse.json(
				{ error: '[ERROR]: Unauthorized' },
				{ status: 401 }
			)
		}

		convex.setAuth(token)
		let providerConfig = await convex.query(
			api.providerConfig.getProviderConfig,
			{
				provider,
			}
		)
		
		// Fallback to OpenRouter if primary provider not available
		let usingOpenRouterFallback = false
		if (!providerConfig && provider !== 'openrouter') {
			const openrouterConfig = await convex.query(
				api.providerConfig.getProviderConfig,
				{
					provider: 'openrouter',
				}
			)
			if (openrouterConfig) {
				providerConfig = openrouterConfig
				usingOpenRouterFallback = true
			}
		}
		
		if (!providerConfig) {
			return NextResponse.json(
				{
					error: `No API key configured for ${provider}. Please add your ${provider} API key or OpenRouter API key in settings.`,
				},
				{ status: 400 }
			)
		}
		// let apiKey: string
		// try {
		// 	apiKey = await decryptApiKey(providerConfig.encryptedApiKey)
		// } catch (error) {
		// 	console.error('[DECRYPT_ERROR]: ', error)
		// 	return NextResponse.json(
		// 		{
		// 			error:
		// 				'[ERROR]: Failed to decrypt API key. Please re-add your API key in settings.',
		// 		},
		// 		{ status: 500 }
		// 	)
		// }
		let apiKey: string
		const actualProvider = usingOpenRouterFallback ? 'openrouter' : provider
		const cacheKey = `${token}_${actualProvider}`
		const cached = providerCache.get(cacheKey)

		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			apiKey = cached.apiKey
		} else {
			apiKey = await decryptApiKey(providerConfig.encryptedApiKey)
			providerCache.set(cacheKey, { apiKey, timestamp: Date.now() })
		}
		let aiModel
		try {
			if (usingOpenRouterFallback) {
				// Use OpenRouter as proxy for any model with correct model ID mapping
				const openrouterProvider = createOpenRouter({ apiKey })
				const openrouterModelId = getOpenRouterModelId(model)
				aiModel = openrouterProvider(openrouterModelId)
			} else {
				switch (provider) {
					case 'openai':
						const openaiProvider = createOpenAI({ apiKey })
						aiModel = openaiProvider(model)
						break
					case 'google':
						const googleProvider = createGoogleGenerativeAI({ apiKey })
						aiModel = googleProvider(model, { useSearchGrounding: true })
						break
					case 'anthropic':
						const anthropicProvider = createAnthropic({ apiKey })
						aiModel = anthropicProvider(model)
						break
					case 'openrouter':
						const openrouterProvider = createOpenRouter({ apiKey })
						aiModel = openrouterProvider(model)
						break
					default:
						return NextResponse.json(
							{
								error: `[ERROR]: Unsupported provider: ${provider}. Supported providers: openai, google, anthropic, openrouter`,
							},
							{ status: 400 }
						)
				}
			}
		} catch (error) {
			console.error('[INIT_ERROR]: ', error)
			return NextResponse.json(
				{
					error: `[ERROR]: Failed to initialize ${usingOpenRouterFallback ? 'OpenRouter (fallback)' : provider} provider. Please check your API key.`,
				},
				{ status: 500 }
			)
		}
		try {
			const result = streamText({
				model: aiModel,
				messages,
				system: system,
				// experimental_transform: smoothStream(),
				onError: (error) => {
					console.log('[AI_ERROR]: ', error)
				},
				abortSignal: req.signal,
				providerOptions: {
					anthropic: {
						thinking: { type: 'enabled', budgetTokens: 12000 },
					} satisfies AnthropicProviderOptions,
				},
			})
			return result.toDataStreamResponse({
				sendReasoning: true,
				sendSources: true,
				getErrorMessage: (error: unknown) => {
					if (!(error instanceof Error)) {
						return 'Unable to complete request. Please try again or check your API key.'
					}

					return 'Unable to complete request. Please try again or check your API key.'
				},
			})
		} catch (error) {
			console.error('[AI_CALL_ERROR]: ', error)
		}
	} catch (error) {
		console.log('[ROUTE_ERROR]: ', error)
		return NextResponse.json(
			{ error: 'Unable to complete request. Please try again.' },
			{ status: 500 }
		)
	}
}
