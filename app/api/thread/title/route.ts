import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { api } from '@/convex/_generated/api'
import { decryptApiKey } from '@/lib/encryption'

export const maxDuration = 30

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: NextRequest) {
	try {
		const token = await convexAuthNextjsToken()
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await req.json()
		const { threadId, needTitle } = body
		const content = body.prompt || body.content

		if (!content) {
			return NextResponse.json(
				{ threadId: threadId, error: 'Content is required' },
				{ status: 400 }
			)
		}

		convex.setAuth(token)

		let providerConfig = await convex.query(
			api.providerConfig.getProviderConfig,
			{ provider: 'google' }
		)
		
		// Fallback to OpenRouter if Google not available
		let usingOpenRouterFallback = false
		if (!providerConfig) {
			const openrouterConfig = await convex.query(
				api.providerConfig.getProviderConfig,
				{ provider: 'openrouter' }
			)
			if (openrouterConfig) {
				providerConfig = openrouterConfig
				usingOpenRouterFallback = true
			}
		}
		
		if (!providerConfig) {
			return NextResponse.json(
				{
					error:
						'No Google API key or OpenRouter API key configured. Please add an API key in settings.',
				},
				{ status: 400 }
			)
		}

		let apiKey: string
		try {
			apiKey = await decryptApiKey(providerConfig.encryptedApiKey)
		} catch (error) {
			console.error('[DECRYPT_ERROR]: ', error)
			return NextResponse.json(
				{
					error:
						'Failed to decrypt API key. Please re-add your API key in settings.',
				},
				{ status: 500 }
			)
		}

		try {
			let aiModel
			if (usingOpenRouterFallback) {
				// Use OpenRouter with a fast model for title generation
				const openrouterProvider = createOpenRouter({ apiKey })
				aiModel = openrouterProvider('google/gemini-2.5-flash')
			} else {
				const googleProvider = createGoogleGenerativeAI({ apiKey })
				aiModel = googleProvider('gemini-1.5-flash')
			}

			const result = await generateText({
				model: aiModel,
				prompt: `Generate a concise, descriptive title (max 50 characters) for this conversation based on the user's first message. Only return the title, nothing else.\n\nUser message: ${content}`,
			})

			return NextResponse.json({
				title: result.text.trim(),
				needTitle,
				threadId,
			})
		} catch (error) {
			console.error('[AI_CALL_ERROR]: ', error)
			return NextResponse.json(
				{ error: `Failed to generate title${usingOpenRouterFallback ? ' (using OpenRouter fallback)' : ''}` },
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
