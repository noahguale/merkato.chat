import {
	ModelConfig,
	ProviderConfig,
	Thread,
	Message,
	Model,
	MODEL_CONFIGS,
} from '@/lib/types'
import { create } from 'zustand'

type ModelStore = {
	currentModel: string
	setCurrentModel: (model: string) => void
	getModelConfig: () => string
}

export const getModelConfig = (model: Model) => MODEL_CONFIGS[model]

export const useModelStore = create<ModelStore>((set, get) => ({
	currentModel: '',
	setCurrentModel: (model) => set({ currentModel: model }),
	getModelConfig: () => get().currentModel,
}))
