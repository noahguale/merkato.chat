import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText, Message, smoothStream } from 'ai'
import { system } from '@/lib/prompt'
import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { decryptApiKey } from '@/lib/encryption'
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { api } from '@/convex/_generated/api'

export const maxDuration = 60

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const MASTER_PASSWORD = process.env.ENCRYPTION_KEY

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

		let apiKey: string
		try {
			apiKey = await decryptApiKey(
				providerConfig.encryptedApiKey,
				MASTER_PASSWORD || ''
			)
		} catch (error) {
			console.error('[DECRYPT_ERROR]: ', error)
			return NextResponse.json(
				{
					error:
						'[ERROR]: Failed to decrypt API key. Please re-add your API key in settings.',
				},
				{ status: 500 }
			)
		}

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

		try {
			const result = streamText({
				model: aiModel,
				messages,
				system: system,
				experimental_transform: smoothStream(),
				onError: (error) => {
					console.log('[AI_ERROR]: ', error)
				},
				abortSignal: req.signal,
			})

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
