'use client'

import dynamic from 'next/dynamic'

const App = dynamic(() => import('../client/app'), {
	ssr: false, // Disable SSR for client-side routing
})

export default function Home() {
	return <App />
}
