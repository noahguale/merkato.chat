'use node'

import { randomBytes, createCipheriv, createDecipheriv } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const TAG_LENGTH = 16

export function encryptApiKey(apiKey: string): string {
	const masterKey = process.env.ENCRYPTION_KEY
	console.log('masterKey', masterKey)

	if (!masterKey) {
		throw new Error('Encryption key not configured')
	}

	if (masterKey.length !== 64) {
		throw new Error('Encryption key must be 32 bytes (64 hex characters)')
	}

	try {
		const iv = randomBytes(IV_LENGTH)
		const key = Buffer.from(masterKey, 'hex')

		const cipher = createCipheriv(ALGORITHM, key, iv)

		const encrypted = Buffer.concat([
			cipher.update(apiKey, 'utf8'),
			cipher.final(),
		])

		const tag = cipher.getAuthTag()

		const combined = Buffer.concat([iv, tag, encrypted])

		return combined.toString('base64')
	} catch (error) {
		throw new Error(
			`Failed to encrypt API key: ${error instanceof Error ? error.message : 'Unknown error'}`
		)
	}
}

export function decryptApiKey(encryptedData: string): string {
	const masterKey = process.env.ENCRYPTION_KEY

	if (!masterKey) {
		throw new Error('Encryption key not configured')
	}

	if (masterKey.length !== 64) {
		throw new Error('Encryption key must be 32 bytes (64 hex characters)')
	}

	try {
		const combined = Buffer.from(encryptedData, 'base64')

		if (combined.length < IV_LENGTH + TAG_LENGTH) {
			throw new Error('Invalid encrypted data format')
		}

		const iv = combined.slice(0, IV_LENGTH)
		const tag = combined.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH)
		const encrypted = combined.slice(IV_LENGTH + TAG_LENGTH)

		const key = Buffer.from(masterKey, 'hex')

		const decipher = createDecipheriv(ALGORITHM, key, iv)
		decipher.setAuthTag(tag)

		const decrypted = Buffer.concat([
			decipher.update(encrypted),
			decipher.final(),
		])

		return decrypted.toString('utf8')
	} catch (error) {
		throw new Error(
			`Failed to decrypt API key: ${error instanceof Error ? error.message : 'Unknown error'}`
		)
	}
}

export function generateMasterKey(): string {
	return randomBytes(32).toString('hex')
}
