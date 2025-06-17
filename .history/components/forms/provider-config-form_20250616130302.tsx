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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'

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
			provider: '',
			displayName: '',
			apiKey: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setIsLoading(true)

			// Encrypt the API key
			const encryptedApiKey = encryptApiKey(values.apiKey)
			const keyPrefix = values.apiKey.substring(0, 7) + '...'

			await addProviderConfig({
				provider: values.provider,
				displayName: values.displayName,
				encryptedApiKey,
				keyPrefix,
			})

			// Reset form
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
							<FormLabel>Provider</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a provider" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{providers.map((provider) => (
										<SelectItem key={provider} value={provider}>
											{provider.charAt(0).toUpperCase() + provider.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="displayName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Display Name</FormLabel>
							<FormControl>
								<Input placeholder="My API Key" {...field} />
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
									placeholder="Enter your API key"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isLoading}>
					{isLoading ? 'Adding...' : 'Add Provider'}
				</Button>
			</form>
		</Form>
	)
}
