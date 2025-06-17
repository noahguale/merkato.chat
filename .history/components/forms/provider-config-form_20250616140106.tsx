'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { encryptApiKey } from '@/convex/lib/encryption'
import { providers } from '@/lib/types'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from '@/components/animate-ui/radix/tabs'
import { Google, Anthropic, OpenAI, OpenRouter } from '@/components/logos'

const formSchema = z.object({
	provider: z.string().min(1, 'Provider is required'),
	displayName: z.string().min(1, 'Display name is required'),
	apiKey: z.string().min(1, 'API key is required'),
})

export function ProviderConfigForm() {
	const [isLoading, setIsLoading] = useState(false)
	const addProviderConfig = useMutation(api.providerConfig.addProviderConfig)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			provider: 'google',
			displayName: '',
			apiKey: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setIsLoading(true)

			const encryptedApiKey = encryptApiKey(values.apiKey)
			const keyPrefix = values.apiKey.substring(0, 7) + '...'

			await addProviderConfig({
				provider: values.provider,
				displayName: values.displayName,
				encryptedApiKey,
				keyPrefix,
			})

			form.reset()
		} catch (error) {
			console.error('Failed to add provider config:', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="provider"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-sm text-muted-foreground">
								Provider
							</FormLabel>
							<Tabs
								defaultValue={field.value}
								className="rounded-lg"
								onValueChange={field.onChange}
							>
								<TabsList className="grid w-full grid-cols-4 ">
									<TabsTrigger value="google">
										<Google className="w-4 h-4" />
									</TabsTrigger>
									<TabsTrigger value="anthropic">
										<Anthropic className="w-4 h-4 fill-black dark:fill-white" />
									</TabsTrigger>
									<TabsTrigger value="openai">
										<OpenAI className="w-4 h-4 fill-black dark:fill-white" />
									</TabsTrigger>
									<TabsTrigger value="openrouter">
										<OpenRouter className="w-4 h-4 fill-black dark:fill-white" />
									</TabsTrigger>
								</TabsList>

								<TabsContent value="google" className="space-y-4 mt-4">
									<p className="text-sm text-muted-foreground">
										Configure your Google AI API key to enable Google-powered
										features.
									</p>

									<FormField
										control={form.control}
										name="displayName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Display Name</FormLabel>
												<FormControl>
													<Input placeholder="My Google API Key" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="apiKey"
										render={({ field }) => (
											<FormItem>
												<FormLabel>API Key</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="Enter your Google API key"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</TabsContent>

								<TabsContent value="anthropic" className="space-y-4 mt-4">
									<p className="text-sm text-muted-foreground">
										Configure your Anthropic API key to enable Anthropic-powered
										features.
									</p>

									<FormField
										control={form.control}
										name="displayName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Display Name</FormLabel>
												<FormControl>
													<Input
														placeholder="My Anthropic API Key"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="apiKey"
										render={({ field }) => (
											<FormItem>
												<FormLabel>API Key</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="Enter your OpenAI API key"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</TabsContent>

								<TabsContent value="openai" className="space-y-4 mt-4">
									<p className="text-sm text-muted-foreground">
										Configure your OpenAI API key to enable OpenAI-powered
										features.
									</p>

									<FormField
										control={form.control}
										name="displayName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Display Name</FormLabel>
												<FormControl>
													<Input placeholder="My OpenAI API Key" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="apiKey"
										render={({ field }) => (
											<FormItem>
												<FormLabel>API Key</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="Enter your OpenAI API key"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</TabsContent>

								<TabsContent value="openrouter" className="space-y-4 mt-4">
									<p className="text-sm text-muted-foreground">
										Configure your OpenAI API key to enable OpenAI-powered
										features.
									</p>

									<FormField
										control={form.control}
										name="displayName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Display Name</FormLabel>
												<FormControl>
													<Input
														placeholder="My OpenRouter API Key"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="apiKey"
										render={({ field }) => (
											<FormItem>
												<FormLabel>API Key</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="Enter your OpenRouter API key"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</TabsContent>
							</Tabs>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isLoading} className="w-full">
					{isLoading ? 'Adding...' : 'Add Provider'}
				</Button>
			</form>
		</Form>
	)
}
