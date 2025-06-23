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
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
	TabsContents,
} from '@/components/animate-ui/radix/tabs'
import { Label } from '@radix-ui/react-label'

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

							{/* <Select onValueChange={field.onChange} defaultValue={field.value}>
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
							</Select> */}
							<Tabs
								defaultValue={field.value}
								className=" rounded-lg"
								onValueChange={field.onChange}
							>
								<TabsList className="grid w-full grid-cols-2 pb-2">
									<TabsTrigger value="google">Google</TabsTrigger>
									<TabsTrigger value="openai">OpenAI</TabsTrigger>
								</TabsList>

								<TabsContents className="mx-1 mb-1 -mt-2 rounded-sm h-full bg-background p-4 space-y-10">
									{providers.map((provider) => (
										<TabsContent key={provider} value={provider}>
											<p className="text-sm text-muted-foreground">
												Make changes to your account here. Click save when
												you&apos;re done.
											</p>

											{/* <div className="space-y-3">
												<div className="space-y-1">
													<Label htmlFor="name">Name</Label>
													<Input id="name" defaultValue="Pedro Duarte" />
												</div>
												<div className="space-y-1">
													<Label htmlFor="username">Username</Label>
													<Input id="username" defaultValue="@peduarte" />
												</div>
											</div> */}

											<FormField
												control={form.control}
												name="displayName"
												render={({ field }) => (
													<FormItem className="space-y-3">
														<div className="space-y-1">
															<FormLabel>Display Name</FormLabel>
														</div>

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
										</TabsContent>
									))}

									{/* <TabsContent value="google" className="space-y-6 p-6">
										<p className="text-sm text-muted-foreground">
											Make changes to your account here. Click save when
											you&apos;re done.
										</p>

										<div className="space-y-3">
											<div className="space-y-1">
												<Label htmlFor="name">Name</Label>
												<Input id="name" defaultValue="Pedro Duarte" />
											</div>
											<div className="space-y-1">
												<Label htmlFor="username">Username</Label>
												<Input id="username" defaultValue="@peduarte" />
											</div>
										</div>

										<Button>Save changes</Button>
									</TabsContent>
									<TabsContent value="openai" className="space-y-6 p-6">
										<p className="text-sm text-muted-foreground">
											Change your password here. After saving, you&apos;ll be
											logged out.
										</p>
										<div className="space-y-3">
											<div className="space-y-1">
												<Label htmlFor="current">Current password</Label>
												<Input id="current" type="password" />
											</div>
											<div className="space-y-1">
												<Label htmlFor="new">New password</Label>
												<Input id="new" type="password" />
											</div>
											<div className="space-y-1">
												<Label htmlFor="confirm">Confirm password</Label>
												<Input id="confirm" type="password" />
											</div>
										</div>

										<Button>Save password</Button>
									</TabsContent> */}
								</TabsContents>
							</Tabs>

							<FormMessage />
						</FormItem>
					)}
				/>

				{/* <FormField
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
				</Button> */}
			</form>
		</Form>
	)
}
