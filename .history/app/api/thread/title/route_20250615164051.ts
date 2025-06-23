import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { decryptApiKey } from '@/convex/lib/encryption'
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { api } from '@/convex/_generated/api'

export const maxDuration = 30

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: NextRequest) {
	try {
		const { threadId, content }: { threadId: string; content: string } =
			await req.json()

		if (!content) {
			return NextResponse.json(
				{ error: 'Content is required' },
				{ status: 400 }
			)
		}

		const token = await convexAuthNextjsToken()
		if (!token) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		convex.setAuth(token)

		const providerConfig = await convex.query(
			api.providerConfig.getProviderConfig,
			{ provider: 'google' }
		)
		if (!providerConfig) {
			return NextResponse.json(
				{
					error:
						'No Google API key configured. Please add your Google API key in settings.',
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
						'Failed to decrypt API key. Please re-add your API key in settings.',
				},
				{ status: 500 }
			)
		}

		try {
			const googleProvider = createGoogleGenerativeAI({ apiKey })
			const aiModel = googleProvider('gemini-1.5-flash')

			const result = await generateText({
				model: aiModel,
				prompt: `Generate a concise, descriptive title (max 50 characters) for this conversation based on the user's first message. Only return the title, nothing else.\n\nUser message: ${content}`,
				maxTokens: 20,
			})

			return NextResponse.json({
				title: result.text.trim(),
			})
		} catch (error) {
			console.error('[AI_CALL_ERROR]: ', error)
			return NextResponse.json(
				{ error: 'Failed to generate title' },
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
