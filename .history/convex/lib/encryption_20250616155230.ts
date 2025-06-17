import { EncryptJWT, jwtDecrypt } from 'jose'
import { v4 as uuidv4 } from 'uuid'

const getSecretKey = () => {
	const secret = process.env.ENCRYPTION_KEY
	if (!secret) {
		throw new Error('ENCRYPTION_KEY environment variable is not set')
	}

	// Convert hex string to bytes
	const bytes = Buffer.from(secret, 'hex')

	// Verify it's exactly 32 bytes (256 bits)
	if (bytes.length !== 32) {
		throw new Error(
			`ENCRYPTION_KEY must be 32 bytes (64 hex chars). Got ${bytes.length} bytes.`
		)
	}

	return new Uint8Array(bytes)
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
