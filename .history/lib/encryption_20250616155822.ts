import { jwtDecrypt } from 'jose'

const getSecretKey = () => {
	const secret = process.env.ENCRYPTION_KEY
	if (!secret) {
		throw new Error('ENCRYPTION_KEY environment variable is not set')
	}

	// Convert hex string to Uint8Array
	if (secret.length !== 64) {
		throw new Error('ENCRYPTION_KEY must be exactly 64 hex characters')
	}

	const bytes = new Uint8Array(32)
	for (let i = 0; i < 32; i++) {
		bytes[i] = parseInt(secret.substring(i * 2, i * 2 + 2), 16)
	}

	return bytes
}

export async function decryptApiKey(encryptedApiKey: string): Promise<string> {
	const secretKey = getSecretKey()

	try {
		const { payload } = await jwtDecrypt(encryptedApiKey, secretKey)

		if (!payload.apiKey || typeof payload.apiKey !== 'string') {
			throw new Error('Invalid encrypted API key format')
		}

		return payload.apiKey
	} catch (error) {
		console.error('Failed to decrypt API key:', error)
		throw new Error(
			'Failed to decrypt API key. Please delete and re-add your API key.'
		)
	}
}
