'use client'

import React from 'react'
import { ThreadMenu, ThreadMenuEnhanced, useThreadMenu } from './thread-menu'
import { Button } from './ui/button'

// Basic example
export function ThreadMenuBasicExample() {
	return (
		<div className="p-4 space-y-4">
			<h2 className="text-lg font-semibold">Basic Thread Menu</h2>
			<div className="max-w-sm">
				<ThreadMenu
					placeholder="Search your threads..."
					triggerText="Find a thread..."
					triggerClassName="w-full"
				/>
			</div>
			<p className="text-sm text-muted-foreground">
				Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">⌘K</kbd> or{' '}
				<kbd className="px-1 py-0.5 text-xs bg-muted rounded">Ctrl+K</kbd> to open
			</p>
		</div>
	)
}

// Enhanced example with grouping
export function ThreadMenuEnhancedExample() {
	return (
		<div className="p-4 space-y-4">
			<h2 className="text-lg font-semibold">Enhanced Thread Menu (with Groups)</h2>
			<div className="max-w-sm">
				<ThreadMenuEnhanced
					placeholder="Search all threads..."
					triggerText="Search threads..."
					triggerClassName="w-full"
				/>
			</div>
			<p className="text-sm text-muted-foreground">
				Shows threads grouped by: Pinned, Recent (last 7 days), and Older
			</p>
		</div>
	)
}

// Controlled example using the hook
export function ThreadMenuControlledExample() {
	const threadMenu = useThreadMenu()

	return (
		<div className="p-4 space-y-4">
			<h2 className="text-lg font-semibold">Controlled Thread Menu</h2>
			<div className="flex gap-2">
				<Button onClick={threadMenu.openThreadMenu} variant="outline">
					Open Thread Search
				</Button>
				<Button onClick={threadMenu.toggleThreadMenu} variant="outline">
					Toggle Thread Search
				</Button>
			</div>
			<ThreadMenu
				placeholder="Search your conversations..."
				triggerText="Thread Search"
				triggerClassName="max-w-md"
				open={threadMenu.open}
				onOpenChange={threadMenu.setOpen}
			/>
			<div className="text-sm text-muted-foreground">
				<p>Menu is currently: <strong>{threadMenu.open ? 'Open' : 'Closed'}</strong></p>
			</div>
		</div>
	)
}

// Integration example for sidebar
export function SidebarThreadMenuExample() {
	const threadMenu = useThreadMenu()

	return (
		<div className="p-4 space-y-4">
			<h2 className="text-lg font-semibold">Sidebar Integration Example</h2>
			<div className="bg-sidebar rounded-lg p-4 max-w-xs">
				<div className="space-y-3">
					<div className="text-sm font-medium text-sidebar-foreground">
						Quick Actions
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="w-full justify-start"
						onClick={threadMenu.openThreadMenu}
					>
						🔍 Search Threads
					</Button>
					<ThreadMenu
						placeholder="Find a thread..."
						triggerText="Search all threads..."
						triggerClassName="w-full h-8 text-xs"
						open={threadMenu.open}
						onOpenChange={threadMenu.setOpen}
					/>
				</div>
			</div>
		</div>
	)
}

// Combined examples page
export function ThreadMenuExamples() {
	return (
		<div className="max-w-4xl mx-auto p-6 space-y-8">
			<div className="text-center space-y-2">
				<h1 className="text-2xl font-bold">Thread Menu Examples</h1>
				<p className="text-muted-foreground">
					Different ways to use the ThreadMenu component
				</p>
			</div>

			<div className="grid gap-8 md:grid-cols-2">
				<ThreadMenuBasicExample />
				<ThreadMenuEnhancedExample />
				<ThreadMenuControlledExample />
				<SidebarThreadMenuExample />
			</div>

			<div className="bg-muted/50 rounded-lg p-6">
				<h3 className="text-lg font-semibold mb-4">Features</h3>
				<ul className="space-y-2 text-sm">
					<li>✅ Search through all your chat threads</li>
					<li>✅ Visual indicators for pinned threads</li>
					<li>✅ Grouped by recency (Pinned, Recent, Older)</li>
					<li>✅ Keyboard navigation with ⌘K/Ctrl+K</li>
					<li>✅ Click to navigate to thread</li>
					<li>✅ Uses the same styling as the command menu</li>
					<li>✅ Real-time data from Convex</li>
					<li>✅ Responsive design</li>
				</ul>
			</div>
		</div>
	)
}