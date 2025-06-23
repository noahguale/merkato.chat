import { ModelConfig, Model, MODEL_CONFIGS, models } from '@/lib/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type ModelStore = {
	currentModel: Model
	setCurrentModel: (model: string) => void
	getModelConfig: () => ModelConfig
}

const DEFAULT_MODEL: Model = 'Gemini 2.5 Flash'

const isValidModel = (model: string): model is Model => {
	return models.includes(model as Model)
}

export const getModelConfig = (model: Model) => MODEL_CONFIGS[model]

export const useModelStore = create<ModelStore>()(
	persist(
		(set, get) => ({
			currentModel: DEFAULT_MODEL,
			setCurrentModel: (model) => {
				if (isValidModel(model)) {
					set({ currentModel: model })
				}
			},
			getModelConfig: () => {
				const currentModel = get().currentModel
				if (isValidModel(currentModel)) {
					return getModelConfig(currentModel)
				}
				return getModelConfig(DEFAULT_MODEL)
			},
		}),
		{
			name: 'set-model',
			storage: createJSONStorage(() => localStorage),
			version: 1,
		}
	)
)
