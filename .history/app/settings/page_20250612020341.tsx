'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import {
	randomBytes,
	createCipheriv,
	createDecipheriv,
	pbkdf2Sync,
} from 'crypto'

// Client-side encryption with user passphrase
function encryptWithPassphrase(apiKey: string, passphrase: string): string {
	const salt = randomBytes(32)
	const key = pbkdf2Sync(passphrase, salt, 100000, 32, 'sha256')
	const iv = randomBytes(16)

	const cipher = createCipheriv('aes-256-gcm', key, iv)
	const encrypted = Buffer.concat([
		cipher.update(apiKey, 'utf8'),
		cipher.final(),
	])
	const tag = cipher.getAuthTag()

	const combined = Buffer.concat([salt, iv, tag, encrypted])
	return combined.toString('base64')
}

export const AddAPIKeyForm = () => {
	const [provider, setProvider] = useState('')
	const [apiKey, setApiKey] = useState('')
	const [passphrase, setPassphrase] = useState('')
	const [displayName, setDisplayName] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const addProviderConfig = useMutation(api.providerConfig.addProviderConfig)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!provider || !apiKey || !passphrase) {
			alert('Please fill in all fields')
			return
		}

		setIsLoading(true)

		try {
			// Encrypt on client with user's passphrase
			const encryptedApiKey = encryptWithPassphrase(apiKey, passphrase)
			const keyPrefix = apiKey.substring(0, 7) + '...'

			await addProviderConfig({
				provider,
				encryptedApiKey,
				keyPrefix,
				displayName: displayName || `${provider} API Key`,
			})

			// Store passphrase in session storage for this session
			sessionStorage.setItem(`passphrase_${provider}`, passphrase)

			// Reset form
			setProvider('')
			setApiKey('')
			setPassphrase('')
			setDisplayName('')

			alert('API key added successfully!')
		} catch (error) {
			console.error('Failed to add API key:', error)
			alert('Failed to add API key. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{/* Your existing provider and API key fields */}

			<div>
				<label>Encryption Passphrase</label>
				<input
					type="password"
					value={passphrase}
					onChange={(e) => setPassphrase(e.target.value)}
					placeholder="Enter a secure passphrase"
					required
				/>
				<p className="text-sm text-gray-600">
					This passphrase encrypts your API key. You'll need it each session.
				</p>
			</div>

			<button type="submit" disabled={isLoading}>
				{isLoading ? 'Adding...' : 'Add API Key'}
			</button>
		</form>
	)
}

export default function SettingsPage() {
	return (
		<div className="container mx-auto py-8">
			<h1 className="text-2xl font-bold mb-6">API Key Settings</h1>
			<AddAPIKeyForm />
		</div>
	)
}
