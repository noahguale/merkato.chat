import { useConvexAuth, useQuery } from 'convex/react'
import { Navigate } from 'react-router'
import { api } from '../../convex/_generated/api'

export default function Home() {
	const { isAuthenticated, isLoading } = useConvexAuth()
	const providers = useQuery(api.providerConfig.getUserProviders)

	if (isLoading) {
		return <div>Loading authentication...</div>
	}

	if (!isAuthenticated) {
		return <Navigate to="/sign-in" replace />
	}

	if (providers !== undefined && providers.length === 0) {
		return <Navigate to="/settings" replace />
	}

	if (providers === undefined) {
		return <div>Loading...</div>
	}

	return <div>Home</div>
}
