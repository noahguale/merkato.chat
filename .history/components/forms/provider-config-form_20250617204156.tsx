'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
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
import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
	TabsContents,
} from '@/components/animate-ui/radix/tabs'
import { Google, Anthropic, OpenAI, OpenRouter } from '@/components/logos'
import { Id } from '@/convex/_generated/dataModel'

const formSchema = z.object({
	provider: z.string().min(1, 'Provider is required'),
	displayName: z.string().min(1, 'Display name is required'),
	apiKey: z.string().min(1, 'API key is required'),
})

export function ProviderConfigForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [selectedProvider, setSelectedProvider] = useState('google')
	const addProviderConfig = useMutation(api.providerConfig.addProviderConfig)
	const deleteProviderConfig = useMutation(
		api.providerConfig.deleteProviderConfig
	)
	const existingConfig = useQuery(api.providerConfig.getProviderConfig, {
		provider: selectedProvider,
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			provider: 'google',
			displayName: '',
			apiKey: '',
		},
	})

	useEffect(() => {
		form.setValue('provider', selectedProvider)
	}, [selectedProvider, form])

	async function onDelete() {
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

	const renderProviderContent = (
		provider: string,
		displayName: string,
		placeholder: string
	) => {
		if (existingConfig) {
			return (
				<div className="w-full h-[240px] py-4 overflow-y-auto overflow-x-hidden">
					<div className="space-y-4">
						<p className="text-sm text-muted-foreground">
							API key configured for {displayName}.
						</p>
						<div className="flex items-center justify-between p-3 border rounded-lg">
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
								onClick={onDelete}
								disabled={isLoading}
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</div>
			)
		}
		return (
			<div className="w-full h-[240px] py-4 overflow-y-auto overflow-x-hidden">
				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">
						Configure your {displayName} API key to enable {displayName}-powered
						features.
					</p>
					<FormField
						control={form.control}
						name="displayName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Display Name</FormLabel>
								<FormControl>
									<Input placeholder={`My ${displayName} API Key`} {...field} />
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
									<Input type="text" placeholder={placeholder} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>
		)
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
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
								onValueChange={(value) => {
									field.onChange(value)
									setSelectedProvider(value)
								}}
							>
								{/* <TabsList className="grid w-full grid-cols-4">
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
								</TabsList> */}
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
								<TabsContents className="h-[260px] overflow-hidden">
									<TabsContent
										value="google"
										className="h-full overflow-y-auto"
									>
										{renderProviderContent(
											'google',
											'Google AI',
											'Enter your Google API key'
										)}
									</TabsContent>
									<TabsContent
										value="anthropic"
										className="h-full overflow-y-auto"
									>
										{renderProviderContent(
											'anthropic',
											'Anthropic',
											'Enter your Anthropic API key'
										)}
									</TabsContent>
									<TabsContent
										value="openai"
										className="h-full overflow-y-auto"
									>
										{renderProviderContent(
											'openai',
											'OpenAI',
											'Enter your OpenAI API key'
										)}
									</TabsContent>
									<TabsContent
										value="openrouter"
										className="h-full overflow-y-auto"
									>
										{renderProviderContent(
											'openrouter',
											'OpenRouter',
											'Enter your OpenRouter API key'
										)}
									</TabsContent>
								</TabsContents>
								<div className="relative w-full h-[240px] overflow-hidden">
									<TabsContent value="google" className="mt-0">
										{renderProviderContent(
											'google',
											'Google AI',
											'Enter your Google API key'
										)}
									</TabsContent>
									<TabsContent value="anthropic" className="mt-0">
										{renderProviderContent(
											'anthropic',
											'Anthropic',
											'Enter your Anthropic API key'
										)}
									</TabsContent>
									<TabsContent value="openai" className="mt-0">
										{renderProviderContent(
											'openai',
											'OpenAI',
											'Enter your OpenAI API key'
										)}
									</TabsContent>
									<TabsContent value="openrouter" className="mt-0">
										{renderProviderContent(
											'openrouter',
											'OpenRouter',
											'Enter your OpenRouter API key'
										)}
									</TabsContent>
								</div>
							</Tabs>
							<FormMessage />
						</FormItem>
					)}
				/>
				{!existingConfig && (
					<Button type="submit" disabled={isLoading} className="w-full">
						{isLoading ? 'Adding...' : 'Add Provider'}
					</Button>
				)}
			</form>
		</Form>
	)
}
