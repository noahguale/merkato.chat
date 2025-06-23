import { useConvexAuth, useQuery } from 'convex/react'
import { Navigate } from 'react-router'
import { api } from '../../convex/_generated/api'
import { useModelStore } from '../../store/model-store'
import { Chat } from '@/components/chat'
export default function Home() {
	const { isAuthenticated, isLoading } = useConvexAuth()
	const providers = useQuery(api.providerConfig.getUserProviders)
	const hasHydrated = useModelStore.persist?.hasHydrated()

	if (isLoading || !hasHydrated) {
		return <div>Loading...</div>
	}

	if (!isAuthenticated) {
		return <Navigate to="/sign-in" replace />
	}

	if (providers !== undefined && providers.length === 0) {
		return <Navigate to="/settings" replace />
	}

	return <Chat threadId={null} initialMessages={[]} />
}
