export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const STEPS = [
  { id: 'upload', label: '上传', icon: 'Upload' },
  { id: 'processing', label: '处理', icon: 'Cpu' },
  { id: 'result', label: '结果', icon: 'Check' },
] as const;

export const PROCESSING_MESSAGES: Array<{ threshold: number; message: string }> = [
  { threshold: 0, message: '正在分析您的照片...' },
  { threshold: 15, message: '正在识别服装特征...' },
  { threshold: 40, message: '正在试穿服装...' },
  { threshold: 70, message: '正在精细调整...' },
  { threshold: 90, message: '即将完成...' },
];

export const SAMPLE_CLOTHING = [
  {
    id: '1',
    name: '白色T恤',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
    category: '上装',
  },
  {
    id: '2',
    name: '蓝色牛仔外套',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop',
    category: '外套',
  },
  {
    id: '3',
    name: '黑色连帽衫',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop',
    category: '上装',
  },
  {
    id: '4',
    name: '格纹衬衫',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop',
    category: '上装',
  },
  {
    id: '5',
    name: '皮夹克',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop&q=80',
    category: '外套',
  },
  {
    id: '6',
    name: '运动卫衣',
    imageUrl: 'https://images.unsplash.com/photo-1578768079470-e197e1a50fa1?w=300&h=400&fit=crop',
    category: '上装',
  },
];
