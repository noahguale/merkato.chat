import { openai } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'
import { streamText, Message, smoothStream } from 'ai'
import { system } from '@/lib/prompt'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: NextRequest) {
	try {
		const { messages }: { messages: Message[] } = await req.json()

		const result = streamText({
			model: google('gemini-2.0-flash'),
			messages,
			system: system,
			experimental_transform: smoothStream(),
			onError: (error) => {
				console.log('[ERROR]: ', error)
			},
			abortSignal: req.signal,
		})

		return result.toDataStreamResponse({
			sendReasoning: true,
			getErrorMessage: (error) => {
				console.error('[ERROR]: ', error)
				return 'Unable to complete request. Please try again.'
			},
		})
	} catch (error) {
		console.log('[ERROR]: ', error)
		return NextResponse.json(
			{ error: 'Unable to complete request. Please try again.' },
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		)
	}
}
