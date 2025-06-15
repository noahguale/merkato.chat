'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FieldError } from 'react-hook-form'
import { z } from 'zod'
import { encryptApiKey } from '@/lib/encryption'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React from 'react'

const formSchema = z.object({
	provider: z.string(),
	displayName: z.string(),
	apiKey: z.string(),
})

export function ProviderConfigForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {},
	})

	const [error, setError] = React.useState<string | null>(null)

	function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const encryptedApiKey = encryptApiKey(values.apiKey)
			// Replace this with your actual save logic
			console.log({ ...values, apiKey: encryptedApiKey })
			setError(null)
		} catch (e: any) {
			setError(e.message || 'Encryption failed')
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="provider"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Provider</FormLabel>
							<FormControl>
								<Input placeholder="Provider name" {...field} />
							</FormControl>
							<FormDescription>
								The provider's identifier (e.g., openai).
							</FormDescription>
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
								<Input placeholder="Display name" {...field} />
							</FormControl>
							<FormDescription>
								This is your public display name for the provider.
							</FormDescription>
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
									placeholder="API Key"
									autoComplete="off"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Your secret API key. It will be encrypted before saving.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				{error && <div className="text-red-500 text-sm">{error}</div>}
				<button type="submit" className="btn btn-primary">
					Save
				</button>
			</form>
		</Form>
	)
}
