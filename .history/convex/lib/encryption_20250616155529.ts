import { EncryptJWT, jwtDecrypt } from 'jose'
import { v4 as uuidv4 } from 'uuid'

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

export async function encryptApiKey(apiKey: string): Promise<string> {
	const secretKey = getSecretKey()

	const jwt = await new EncryptJWT({ apiKey })
		.setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
		.setIssuedAt()
		.setJti(uuidv4())
		.encrypt(secretKey)

	return jwt
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
