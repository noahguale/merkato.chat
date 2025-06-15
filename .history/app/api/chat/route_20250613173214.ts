import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText, Message, smoothStream } from 'ai'
import { system } from '@/lib/prompt'
import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { decryptApiKey } from '@/convex/lib/encryption'
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { api } from '@/convex/_generated/api'

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
			apiKey = decryptApiKey(providerConfig.encryptedApiKey)
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
				getErrorMessage: (error: any) => {
					console.error('[AI_ERROR]: ', error)

					if (
						error.message?.includes('401') ||
						error.message?.includes('Unauthorized')
					) {
						return 'Error with API key. Either invalid or expired. Please update your API key in settings.'
					}

					if (
						error.message?.includes('403') ||
						error.message?.includes('Forbidden')
					) {
						return 'Error with API key permissions. Please check your API key has the required permissions.'
					}

					if (
						error.message?.includes('429') ||
						error.message?.includes('rate limit')
					) {
						return 'Rate limit exceeded. Please try again later or check your API usage.'
					}

					if (
						error.message?.includes('insufficient_quota') ||
						error.message?.includes('quota')
					) {
						return 'API quota exceeded. Please check your account usage and billing.'
					}

					return 'Unable to complete request. Please try again or check your API key.'
				},
			})
		} catch (error: any) {
			console.error('[AI_CALL_ERROR]: ', error)

			if (error.status === 403 || error.message?.includes('403')) {
				return NextResponse.json(
					{
						error:
							'Error with API key permissions. Please check your API key has the required permissions.',
					},
					{ status: 403 }
				)
			}

			if (error.status === 429 || error.message?.includes('rate limit')) {
				return NextResponse.json(
					{
						error: 'Rate limit exceeded. Please try again later.',
					},
					{ status: 429 }
				)
			}

			return NextResponse.json(
				{ error: 'Unable to complete request. Please try again.' },
				{ status: 500 }
			)
		}
	} catch (error) {
		console.log('[ROUTE_ERROR]: ', error)
		return NextResponse.json(
			{ error: 'Unable to complete request. Please try again.' },
			{ status: 500 }
		)
	}
}
