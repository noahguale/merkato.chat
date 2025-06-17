const ALGORITHM = 'AES-GCM'
const IV_LENGTH = 12
const SALT_LENGTH = 16

async function getKeyMaterial(password: string): Promise<CryptoKey> {
	const encoder = new TextEncoder()
	return await crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		'PBKDF2',
		false,
		['deriveBits', 'deriveKey']
	)
}

async function getKey(
	keyMaterial: CryptoKey,
	salt: BufferSource
): Promise<CryptoKey> {
	return await crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: salt,
			iterations: 100000,
			hash: 'SHA-256',
		},
		keyMaterial,
		{ name: ALGORITHM, length: 256 },
		false,
		['encrypt', 'decrypt']
	)
}

export async function encryptApiKey(
	apiKey: string,
	masterPassword: string
): Promise<string> {
	const encoder = new TextEncoder()
	const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
	const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))

	const keyMaterial = await getKeyMaterial(masterPassword)
	const key = await getKey(keyMaterial, salt)

	const encrypted = await crypto.subtle.encrypt(
		{
			name: ALGORITHM,
			iv: iv,
		},
		key,
		encoder.encode(apiKey)
	)

	const encryptedArray = new Uint8Array(encrypted)
	const combined = new Uint8Array(
		salt.length + iv.length + encryptedArray.length
	)
	combined.set(salt, 0)
	combined.set(iv, salt.length)
	combined.set(encryptedArray, salt.length + iv.length)

	return btoa(String.fromCharCode(...combined))
}

export async function decryptApiKey(
	encryptedData: string,
	masterPassword: string
): Promise<string> {
	const combined = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0))

	const salt = combined.slice(0, SALT_LENGTH)
	const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
	const encrypted = combined.slice(SALT_LENGTH + IV_LENGTH)

	const keyMaterial = await getKeyMaterial(masterPassword)
	const key = await getKey(keyMaterial, salt)

	const decrypted = await crypto.subtle.decrypt(
		{
			name: ALGORITHM,
			iv: iv,
		},
		key,
		encrypted
	)

	const decoder = new TextDecoder()
	return decoder.decode(decrypted)
}
