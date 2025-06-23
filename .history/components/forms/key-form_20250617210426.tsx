'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useState, useEffect } from 'react'
import { Trash2, Key } from 'lucide-react'
import { Id } from '@/convex/_generated/dataModel'

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
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from '@/components/animate-ui/radix/tabs'
import { Google, Anthropic, OpenAI, OpenRouter } from '@/components/logos'

const keyFormSchema = z.object({
	provider: z.string().min(1, 'Provider is required'),
	displayName: z.string().min(1, 'Display name is required'),
	apiKey: z.string().min(1, 'API key is required'),
})

type KeyFormValues = z.infer<typeof keyFormSchema>

interface ProviderInfo {
	id: string
	name: string
	placeholder: string
	linkUrl: string
}

const providerDetails: Record<string, ProviderInfo> = {
	google: {
		id: 'google',
		name: 'Google AI',
		placeholder: 'AIza...',
		linkUrl: 'https://aistudio.google.com/apikey',
	},
	anthropic: {
		id: 'anthropic',
		name: 'Anthropic',
		placeholder: 'sk-ant-...',
		linkUrl: 'https://console.anthropic.com/account/keys',
	},
	openai: {
		id: 'openai',
		name: 'OpenAI',
		placeholder: 'sk-...',
		linkUrl: 'https://platform.openai.com/api-keys',
	},
	openrouter: {
		id: 'openrouter',
		name: 'OpenRouter',
		placeholder: 'sk-or-...',
		linkUrl: 'https://openrouter.ai/settings/keys',
	},
}

export function KeyForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [selectedProvider, setSelectedProvider] = useState('google')
	const addProviderConfig = useMutation(api.providerConfig.addProviderConfig)
	const deleteProviderConfig = useMutation(
		api.providerConfig.deleteProviderConfig
	)
	const existingConfig = useQuery(api.providerConfig.getProviderConfig, {
		provider: selectedProvider,
	})

	const form = useForm<KeyFormValues>({
		resolver: zodResolver(keyFormSchema),
		defaultValues: {
			provider: 'google',
			displayName: '',
			apiKey: '',
		},
	})

	useEffect(() => {
		form.setValue('provider', selectedProvider)
	}, [selectedProvider, form])

	async function handleDelete() {
		try {
			setIsLoading(true)
			await deleteProviderConfig({
				id: existingConfig?._id as Id<'providerConfig'>,
			})
			form.reset()
		} catch (error) {
			console.error('Failed to delete provider config:', error)
		} finally {
			setIsLoading(false)
		}
	}

	async function handleSubmit(values: KeyFormValues) {
		try {
			setIsLoading(true)
			await addProviderConfig({
				provider: values.provider,
				displayName: values.displayName,
				apiKey: values.apiKey,
			})
			form.reset()
		} catch (error) {
			console.error('Failed to add provider config:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const renderKeyConfiguration = (provider: ProviderInfo) => {
		if (existingConfig) {
			return (
				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">
						API key configured for {provider.name}.
					</p>
					<div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
						<div className="space-y-1">
							<p className="text-sm font-medium">
								{existingConfig.displayName}
							</p>
							<p className="text-xs text-muted-foreground">
								Key: {existingConfig.keyPrefix}
							</p>
						</div>
						<Button
							type="button"
							variant="destructive"
							size="sm"
							onClick={handleDelete}
							disabled={isLoading}
						>
							<Trash2 className="w-4 h-4" />
						</Button>
					</div>
				</div>
			)
		}

		return (
			<div className="space-y-4">
				<p className="text-sm text-muted-foreground">
					Configure your {provider.name} API key to enable {provider.name}
					-powered features.
				</p>

				<div className="space-y-4">
					<FormField
						control={form.control}
						name="displayName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Display Name</FormLabel>
								<FormControl>
									<Input
										placeholder={`My ${provider.name} API Key`}
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
										type="text"
										placeholder={provider.placeholder}
										{...field}
									/>
								</FormControl>
								<a
									href={provider.linkUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-blue-500 inline-block mt-1"
								>
									Create {provider.name} API Key
								</a>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>
		)
	}

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<div className="flex items-center gap-2">
					<Key className="h-5 w-5" />
					<CardTitle>API Key Configuration</CardTitle>
				</div>
				<CardDescription>
					Manage your API keys for different AI providers.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="provider"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm text-muted-foreground">
										Select Provider
									</FormLabel>
									<Tabs
										defaultValue={field.value}
										className="rounded-lg"
										onValueChange={(value) => {
											field.onChange(value)
											setSelectedProvider(value)
										}}
									>
										<TabsList className="grid w-full grid-cols-4">
											<TabsTrigger value="google">
												<Google className="w-4 h-4 fill-black dark:fill-white" />
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

										<div className="mt-6">
											<TabsContent value="google">
												{renderKeyConfiguration(providerDetails.google)}
											</TabsContent>

											<TabsContent value="anthropic">
												{renderKeyConfiguration(providerDetails.anthropic)}
											</TabsContent>

											<TabsContent value="openai">
												{renderKeyConfiguration(providerDetails.openai)}
											</TabsContent>

											<TabsContent value="openrouter">
												{renderKeyConfiguration(providerDetails.openrouter)}
											</TabsContent>
										</div>
									</Tabs>
									<FormMessage />
								</FormItem>
							)}
						/>

						{!existingConfig && (
							<Button type="submit" disabled={isLoading} className="w-full">
								{isLoading ? 'Adding...' : 'Add API Key'}
							</Button>
						)}
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
