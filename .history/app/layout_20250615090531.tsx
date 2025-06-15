import type { Metadata } from 'next'
import { Geist, Geist_Mono, Lora, IBM_Plex_Sans } from 'next/font/google'
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server'
import './globals.css'
import { ConvexClientProvider } from '@/components/convex-client-provider'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

const lora = Lora({
	variable: '--font-lora',
	subsets: ['latin'],
})

const ibmPlexSans = IBM_Plex_Sans({
	variable: '--font-ibm-plex-sans',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'merkato',
	description:
		'Get access to premium AI models including GPT-4, Claude, DeepSeek, Gemini and more. Experience the best AI models in the best AI chat app.',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ConvexAuthNextjsServerProvider>
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${ibmPlexSans.variable} antialiased`}
				>
					<ConvexClientProvider>{children}</ConvexClientProvider>
				</body>
			</html>
		</ConvexAuthNextjsServerProvider>
	)
}
