import { useConvexAuth } from 'convex/react'
import { Navigate } from 'react-router'

export default function Home() {
	const { isAuthenticated, isLoading } = useConvexAuth()

	if (isLoading) {
		return <div>Loading authentication...</div>
	}

	if (!isAuthenticated) {
		return <Navigate to="/sign-in" replace />
	}

	return <div>Home</div>
}
