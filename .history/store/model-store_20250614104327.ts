import { ModelConfig, Model, MODEL_CONFIGS } from '@/lib/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type ModelStore = {
	currentModel: Model
	setCurrentModel: (model: Model) => void
	getModelConfig: () => ModelConfig
}

export const getModelConfig = (model: Model) => MODEL_CONFIGS[model]

export const useModelStore = create<ModelStore>()(
	persist(
		(set, get) => ({
			currentModel: 'Gemini 2.5 Flash',
			setCurrentModel: (model) => set({ currentModel: model }),
			getModelConfig: () => {
				const currentModel = get().currentModel
				const modelConfig = getModelConfig(currentModel as Model)
				return modelConfig
			},
		}),
		{
			name: 'set-model',
			storage: createJSONStorage(() => localStorage),
		}
	)
)
