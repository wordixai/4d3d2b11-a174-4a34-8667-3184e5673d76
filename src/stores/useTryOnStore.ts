import { create } from 'zustand';

export type TryOnStep = 'upload' | 'processing' | 'result';

export type ProcessingStatus =
  | 'analyzing'
  | 'fitting'
  | 'generating'
  | 'finalizing';

interface TryOnState {
  currentStep: TryOnStep;
  setStep: (step: TryOnStep) => void;

  personImage: File | null;
  personImagePreview: string | null;
  setPersonImage: (file: File | null) => void;

  clothingImage: File | null;
  clothingImagePreview: string | null;
  clothingImageUrl: string | null;
  setClothingImage: (file: File | null) => void;
  setClothingImageUrl: (url: string | null) => void;

  processingStatus: ProcessingStatus;
  processingProgress: number;
  predictionId: string | null;
  setProcessingStatus: (status: ProcessingStatus) => void;
  setProcessingProgress: (progress: number) => void;
  setPredictionId: (id: string | null) => void;

  resultImageUrl: string | null;
  setResultImageUrl: (url: string | null) => void;

  error: string | null;
  setError: (error: string | null) => void;

  startGeneration: () => void;
  reset: () => void;
}

export const useTryOnStore = create<TryOnState>((set, get) => ({
  currentStep: 'upload',
  setStep: (step) => set({ currentStep: step }),

  personImage: null,
  personImagePreview: null,
  setPersonImage: (file) => {
    const prev = get().personImagePreview;
    if (prev) URL.revokeObjectURL(prev);
    if (file) {
      const preview = URL.createObjectURL(file);
      set({ personImage: file, personImagePreview: preview });
    } else {
      set({ personImage: null, personImagePreview: null });
    }
  },

  clothingImage: null,
  clothingImagePreview: null,
  clothingImageUrl: null,
  setClothingImage: (file) => {
    const prev = get().clothingImagePreview;
    if (prev) URL.revokeObjectURL(prev);
    if (file) {
      const preview = URL.createObjectURL(file);
      set({ clothingImage: file, clothingImagePreview: preview, clothingImageUrl: null });
    } else {
      set({ clothingImage: null, clothingImagePreview: null });
    }
  },
  setClothingImageUrl: (url) => {
    const prev = get().clothingImagePreview;
    if (prev) URL.revokeObjectURL(prev);
    set({ clothingImage: null, clothingImagePreview: null, clothingImageUrl: url });
  },

  processingStatus: 'analyzing',
  processingProgress: 0,
  predictionId: null,
  setProcessingStatus: (status) => set({ processingStatus: status }),
  setProcessingProgress: (progress) => set({ processingProgress: progress }),
  setPredictionId: (id) => set({ predictionId: id }),

  resultImageUrl: null,
  setResultImageUrl: (url) => set({ resultImageUrl: url }),

  error: null,
  setError: (error) => set({ error }),

  startGeneration: () => {
    set({
      currentStep: 'processing',
      processingStatus: 'analyzing',
      processingProgress: 0,
      error: null,
    });
  },

  reset: () => {
    const state = get();
    if (state.personImagePreview) URL.revokeObjectURL(state.personImagePreview);
    if (state.clothingImagePreview) URL.revokeObjectURL(state.clothingImagePreview);
    set({
      currentStep: 'upload',
      personImage: null,
      personImagePreview: null,
      clothingImage: null,
      clothingImagePreview: null,
      clothingImageUrl: null,
      processingStatus: 'analyzing',
      processingProgress: 0,
      predictionId: null,
      resultImageUrl: null,
      error: null,
    });
  },
}));
