import { useMutation, useQuery } from '@tanstack/react-query';
import { startTryOn, checkTryOnStatus } from '@/lib/api';
import { fileToBase64 } from '@/lib/image-utils';
import { useTryOnStore } from '@/stores/useTryOnStore';

export function useStartGeneration() {
  const store = useTryOnStore();

  return useMutation({
    mutationFn: async () => {
      const personBase64 = store.personImage
        ? await fileToBase64(store.personImage)
        : null;

      const clothingBase64 = store.clothingImage
        ? await fileToBase64(store.clothingImage)
        : store.clothingImageUrl;

      if (!personBase64 || !clothingBase64) {
        throw new Error('请上传人物照片和服装图片');
      }

      return startTryOn(personBase64, clothingBase64);
    },
    onSuccess: (data) => {
      store.setPredictionId(data.predictionId);
      store.setStep('processing');
    },
    onError: (error: Error) => {
      store.setError(error.message);
    },
  });
}

export function usePollResult(predictionId: string | null) {
  const store = useTryOnStore();

  return useQuery({
    queryKey: ['tryOnResult', predictionId],
    queryFn: () => checkTryOnStatus(predictionId!),
    enabled: !!predictionId && store.currentStep === 'processing',
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'succeeded' || data?.status === 'failed') return false;
      return 3000;
    },
  });
}
