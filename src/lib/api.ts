import { supabase } from './supabase';

export async function startTryOn(
  personImage: string,
  clothingImage: string,
  garmentDescription?: string
): Promise<{ predictionId: string; status: string }> {
  const { data, error } = await supabase.functions.invoke('virtual-try-on', {
    body: {
      action: 'generate',
      personImage,
      clothingImage,
      garmentDescription,
    },
  });

  if (error) {
    throw new Error('生成请求失败，请稍后重试');
  }

  return data;
}

export async function checkTryOnStatus(
  predictionId: string
): Promise<{ status: string; output?: string; error?: string }> {
  const { data, error } = await supabase.functions.invoke('virtual-try-on', {
    body: {
      action: 'status',
      predictionId,
    },
  });

  if (error) {
    throw new Error('状态查询失败');
  }

  return data;
}
