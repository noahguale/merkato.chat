'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FieldError } from 'react-hook-form'
import { z } from 'zod'

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

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values)
	}
}

interface ProviderConfigFieldProps {
	id: string
	provider: string
	displayName: string
	url: string
	keyPrefix: string
	error?: FieldError | undefined
}
const ProviderField = (): ProviderConfigFieldProps => {
	return (
		<FormField
			control={form.control}
			name="username"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Username</FormLabel>
					<FormControl>
						<Input placeholder="shadcn" {...field} />
					</FormControl>
					<FormDescription>This is your public display name.</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
