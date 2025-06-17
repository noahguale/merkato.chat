import { EncryptJWT, jwtDecrypt } from 'jose'
import { v4 as uuidv4 } from 'uuid'

const getSecretKey = () => {
	const secret = process.env.ENCRYPTION_KEY
	if (!secret) {
		throw new Error('ENCRYPTION_KEY environment variable is not set')
	}
	if (secret.length < 32) {
		throw new Error('ENCRYPTION_KEY must be at least 32 characters')
	}
	return new TextEncoder().encode(secret)
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

	const { payload } = await jwtDecrypt(encryptedApiKey, secretKey)

	if (!payload.apiKey || typeof payload.apiKey !== 'string') {
		throw new Error('Invalid encrypted API key format')
	}

	return payload.apiKey
}
