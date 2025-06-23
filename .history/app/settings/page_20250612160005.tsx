'use client'

import { ProviderConfigForm } from '@/components/forms/provider-config-form'

export default function SettingsPage() {
	return (
		<div className="container mx-auto py-8 px-4">
			<div className="max-w-2xl mx-auto">
				<div className="mb-8">
					<h1 className="text-2xl font-bold mb-2">API Key Settings</h1>
					<p className="text-gray-600">
						Add your API keys to enable different AI providers. Your keys are
						encrypted and stored securely.
					</p>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="text-lg font-semibold mb-4">Add New API Key</h2>
					<ProviderConfigForm />
				</div>
			</div>
		</div>
	)
}
