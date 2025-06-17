'use client'

import React from 'react'
import { SimpleCommandMenu } from './simple-command-menu'
import { MessageSquarePlus, Search, Settings, Users, FileText } from 'lucide-react'

// Example usage of the SimpleCommandMenu component
export function SimpleCommandMenuExample() {
	const handleItemSelect = (item: any) => {
		console.log('Selected item:', item)
	}

	const sampleItems = [
		{
			id: 'new-chat',
			label: 'New Chat',
			icon: <MessageSquarePlus className="size-4" />,
			action: () => {
				// Navigate to new chat
				window.location.href = '/chat'
			},
			keywords: ['chat', 'new', 'conversation']
		},
		{
			id: 'search-threads',
			label: 'Search Threads',
			icon: <Search className="size-4" />,
			action: () => {
				// Open search modal
				console.log('Opening search...')
			},
			keywords: ['search', 'find', 'threads']
		},
		{
			id: 'settings',
			label: 'Settings',
			icon: <Settings className="size-4" />,
			action: () => {
				// Navigate to settings
				window.location.href = '/settings'
			},
			keywords: ['settings', 'preferences', 'config']
		},
		{
			id: 'users',
			label: 'Manage Users',
			icon: <Users className="size-4" />,
			action: () => {
				// Navigate to users
				window.location.href = '/users'
			},
			keywords: ['users', 'people', 'team']
		},
		{
			id: 'docs',
			label: 'Documentation',
			icon: <FileText className="size-4" />,
			action: () => {
				// Open documentation
				window.open('https://docs.example.com', '_blank')
			},
			keywords: ['docs', 'documentation', 'help']
		}
	]

	return (
		<div className="p-4">
			<h2 className="text-lg font-semibold mb-4">Simple Command Menu Example</h2>
			<SimpleCommandMenu
				placeholder="Search commands..."
				triggerText="Search documentation..."
				items={sampleItems}
				onItemSelect={handleItemSelect}
				triggerClassName="max-w-sm"
			/>
			<div className="mt-4 text-sm text-muted-foreground">
				<p>Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">⌘K</kbd> or <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Ctrl+K</kbd> to open the command menu</p>
			</div>
		</div>
	)
}