import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import {
	streamText,
	Message,
	smoothStream,
	createDataStream,
	generateId,
} from 'ai'
import { system } from '@/lib/prompt'
import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { decryptApiKey } from '@/convex/lib/encryption'
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { api } from '@/convex/_generated/api'
import { createResumableStreamContext } from 'resumable-stream'
import { after } from 'next/server'
import { Id } from '@/convex/_generated/dataModel'

export const maxDuration = 60

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const streamContext = createResumableStreamContext({
	waitUntil: after,
})

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const chatId = searchParams.get('chatId')

	if (!chatId) {
		return NextResponse.json({ error: 'chatId is required' }, { status: 400 })
	}

	const token = await convexAuthNextjsToken()
	if (!token) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	convex.setAuth(token)

	try {
		const streamIds = await convex.query(api.stream.getActiveStreams, {
			threadId: chatId as Id<'threads'>,
		})

		if (!streamIds.length) {
			return new Response('No active streams found', { status: 404 })
		}

		const recentStreamId = streamIds[0]

		const emptyDataStream = createDataStream({
			execute: () => {},
		})

		const stream = await streamContext.resumableStream(
			recentStreamId,
			() => emptyDataStream
		)

		if (stream) {
			return new Response(stream, {
				status: 200,
				headers: {
					'Content-Type': 'text/event-stream',
					'Cache-Control': 'no-cache',
					Connection: 'keep-alive',
				},
			})
		}

		const messages = await convex.query(api.chat.getMessages, {
			threadId: chatId as Id<'threads'>,
		})

		const mostRecentMessage = messages.at(-1)

		if (!mostRecentMessage || mostRecentMessage.role !== 'assistant') {
			return new Response(emptyDataStream, {
				status: 200,
				headers: {
					'Content-Type': 'text/event-stream',
					'Cache-Control': 'no-cache',
					Connection: 'keep-alive',
				},
			})
		}

		const streamWithMessage = createDataStream({
			execute: (buffer) => {
				buffer.writeData({
					type: 'append-message',
					message: JSON.stringify({
						id: mostRecentMessage.id,
						content: mostRecentMessage.content,
						role: mostRecentMessage.role,
						createdAt: mostRecentMessage.createdAt,
					}),
				})
			},
		})

		return new Response(streamWithMessage, {
			status: 200,
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
			},
		})
	} catch (error) {
		console.error('[GET_ERROR]:', error)
		return NextResponse.json(
			{ error: 'Failed to resume stream' },
			{ status: 500 }
		)
	}
}

export async function POST(req: NextRequest) {
	try {
		const {
			messages,
			provider,
			model,
			threadId,
		}: {
			messages: Message[]
			provider: string
			model: string
			threadId?: string
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

		const streamId = generateId()

		if (threadId) {
			try {
				await convex.mutation(api.stream.createStreamSession, {
					threadId: threadId as Id<'threads'>,
					streamId,
				})
			} catch (error) {
				console.error('[STREAM_SESSION_ERROR]: ', error)
			}
		}

		try {
			const stream = createDataStream({
				execute: async (dataStream) => {
					const result = streamText({
						model: aiModel,
						messages,
						system: system,
						experimental_transform: smoothStream(),
						onFinish: async () => {
							if (threadId) {
								try {
									await convex.mutation(api.stream.updateStreamStatus, {
										streamId,
										status: 'completed',
									})
								} catch (error) {
									console.error('[UPDATE_STATUS_ERROR]: ', error)
								}
							}
						},
						onError: (error) => {
							console.log('[AI_ERROR]: ', error)
							if (threadId) {
								convex
									.mutation(api.stream.updateStreamStatus, {
										streamId,
										status: 'failed',
									})
									.catch(console.error)
							}
						},
						abortSignal: req.signal,
					})

					result.mergeIntoDataStream(dataStream)
				},
			})

			return new Response(
				await streamContext.resumableStream(streamId, () => stream),
				{
					headers: {
						'Content-Type': 'text/event-stream',
						'Cache-Control': 'no-cache',
						Connection: 'keep-alive',
					},
				}
			)
		} catch (error) {
			console.error('[AI_CALL_ERROR]: ', error)
			if (threadId) {
				try {
					await convex.mutation(api.stream.updateStreamStatus, {
						streamId,
						status: 'failed',
					})
				} catch (updateError) {
					console.error('[UPDATE_STATUS_ERROR]: ', updateError)
				}
			}
			return NextResponse.json(
				{
					error:
						'Unable to complete request. Please try again or check your API key.',
				},
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
