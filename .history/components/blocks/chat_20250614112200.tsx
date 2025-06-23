import { useModelStore } from '@/store/model-store'
import { Message } from '@ai-sdk/react'
import { v4 as uuidv4 } from 'uuid'

interface ChatProps {
	threadId: string
	initialMessages: Message[]
}

export default function Chat({
	threadId = uuidv4(),
	initialMessages = [],
}: ChatProps) {
	const { currentModel, setCurrentModel, getModelConfig } = useModelStore()

	return <div>Chat</div>
}
