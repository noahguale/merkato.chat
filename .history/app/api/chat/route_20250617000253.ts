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

export const runtime = 'edge'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const providerCache = new Map<string, { apiKey: string; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export const maxDuration = 60

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: NextRequest) {
	console.time('Total API Time')
	console.time('Setup Time')

	try {
		console.timeEnd('Setup Time')
		console.time('Message Processing Time')
		const {
			messages,
			provider,
			model,
		}: {
			messages: Message[]
			provider: string
			model: string
		} = await req.json()
		console.timeEnd('Message Processing Time')
		console.time('Provider Check Time')
		if (!provider || !model) {
			return NextResponse.json(
				{
					error: '[ERROR]: Both provider and model are required',
				},
				{ status: 400 }
			)
		}
		console.timeEnd('Provider Check Time')
		console.time('Token Check Time')
		const token = await convexAuthNextjsToken()
		if (!token) {
			return NextResponse.json(
				{ error: '[ERROR]: Unauthorized' },
				{ status: 401 }
			)
		}
		console.timeEnd('Token Check Time')
		convex.setAuth(token)
		console.timeEnd('Token Check Time')
		const providerConfig = await convex.query(
			api.providerConfig.getProviderConfig,
			{
				provider,
			}
		)
		if (!providerConfig) {
			return NextResponse.json(
				{
					error: `No API key configured for ${provider}. Please add your ${provider} API key in settings.`,
				},
				{ status: 400 }
			)
		}
		console.timeEnd('Provider Config Check Time')
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
		console.timeEnd('Provider Config Check Time')
		console.time('API Key Check Time')
		let apiKey: string
		const cacheKey = `${token}_${provider}`
		const cached = providerCache.get(cacheKey)

		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			apiKey = cached.apiKey
		} else {
			const providerConfig = await convex.query(
				api.providerConfig.getProviderConfig,
				{ provider }
			)

			if (!providerConfig) {
				return NextResponse.json(
					{ error: `No API key configured for ${provider}` },
					{ status: 400 }
				)
			}

			apiKey = await decryptApiKey(providerConfig.encryptedApiKey)
			providerCache.set(cacheKey, { apiKey, timestamp: Date.now() })
		}
		console.timeEnd('API Key Check Time')
		console.time('AI Model Check Time')
		let aiModel
		try {
			switch (provider) {
				case 'openai':
					const openaiProvider = createOpenAI({ apiKey })
					aiModel = openaiProvider(model)
					break
				case 'google':
					const googleProvider = createGoogleGenerativeAI({ apiKey })
					aiModel = googleProvider(model)
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
		} catch (error) {
			console.error('[INIT_ERROR]: ', error)
			return NextResponse.json(
				{
					error: `[ERROR]: Failed to initialize ${provider} provider. Please check your API key.`,
				},
				{ status: 500 }
			)
		}
		console.timeEnd('AI Model Check Time')
		console.time('Stream Text Time')
		try {
			const result = streamText({
				model: aiModel,
				messages,
				system: system,
				// experimental_transform: smoothStream(),
				onError: (error) => {
					console.log('[AI_ERROR]: ', error)
				},
				  providerOptions: {
    anthropic: {
      thinking: { type: 'enabled', budgetTokens: 12000 },
    } satisfies AnthropicProviderOptions,

				abortSignal: req.signal,
			})
			console.timeEnd('Stream Text Time')
			return result.toDataStreamResponse({
				sendReasoning: true,
				getErrorMessage: (error: unknown) => {
					console.log('[AI_ERROR]: ', error)

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
