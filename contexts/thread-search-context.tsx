'use client'

import { createContext, useContext, useState } from 'react'

interface ThreadSearchContextType {
	searchQuery: string
	setSearchQuery: (query: string) => void
}

const ThreadSearchContext = createContext<ThreadSearchContextType | undefined>(
	undefined
)

export function ThreadSearchProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [searchQuery, setSearchQuery] = useState('')

	return (
		<ThreadSearchContext.Provider value={{ searchQuery, setSearchQuery }}>
			{children}
		</ThreadSearchContext.Provider>
	)
}

export function useThreadSearch() {
	const context = useContext(ThreadSearchContext)
	if (context === undefined) {
		throw new Error(
			'useThreadSearch must be used within a ThreadSearchProvider'
		)
	}
	return context
}