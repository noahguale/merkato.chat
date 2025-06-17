import type { Metadata } from 'next'
import {
	Geist,
	Geist_Mono,
	Lora,
	IBM_Plex_Sans,
	IBM_Plex_Mono,
} from 'next/font/google'
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server'
import './globals.css'
import { ConvexClientProvider } from '@/components/convex-client-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { GlobalThreadMenu } from '@/components/thread-menu'

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
	weight: ['400', '500', '600', '700'],
})

const ibmPlexMono = IBM_Plex_Mono({
	variable: '--font-ibm-plex-mono',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
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
			<html lang="en" suppressHydrationWarning>
				<body
					className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased`}
				>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<ConvexClientProvider>
							{children}
							<Toaster />
							<GlobalThreadMenu />
						</ConvexClientProvider>
					</ThemeProvider>
				</body>
			</html>
		</ConvexAuthNextjsServerProvider>
	)
}
