import { useConvexAuth, useQuery } from 'convex/react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { api } from '@/convex/_generated/api'
import { useModelStore } from '@/store/model-store'
import { Chat } from '@/components/chat'
import { Id } from '@/convex/_generated/dataModel'

export default function Thread() {
	const { threadId } = useParams<{ threadId: string }>()
	const navigate = useNavigate()
	const { isAuthenticated, isLoading } = useConvexAuth()
	const providers = useQuery(api.providerConfig.getUserProviders)
	const hasHydrated = useModelStore.persist?.hasHydrated()

	const thread = useQuery(
		api.chat.getThread,
		threadId ? { threadId: threadId as Id<'threads'> } : 'skip'
	)
	const messages = useQuery(
		api.chat.getMessages,
		threadId ? { threadId: threadId as Id<'threads'> } : 'skip'
	)

	if (!hasHydrated || isLoading) {
		return <div>Loading...</div>
	}

	if (!isAuthenticated) {
		return <Navigate to="/sign-in" replace />
	}

	// if (providers !== undefined && providers.length === 0) {
	// 	return <Navigate to="/settings" replace />
	// }

	if (thread === null) {
		return (
			<div>
				<h1>Thread not found</h1>
				<p>
					This conversation doesn&apos;t exist or you don&apos;t have access to
					it.
				</p>
				<button onClick={() => navigate('/chat')}>
					Start a new conversation
				</button>
			</div>
		)
	}

	if (thread === undefined || messages === undefined) {
		return <div>Loading thread...</div>
	}

	const formattedMessages = messages.map((msg) => ({
		...msg,
		createdAt: new Date(msg.createdAt),
	}))

	return <Chat threadId={threadId!} initialMessages={formattedMessages} />
}
