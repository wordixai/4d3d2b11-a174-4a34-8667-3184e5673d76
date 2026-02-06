import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { PersonUpload } from './PersonUpload';
import { ClothingUpload } from './ClothingUpload';
import { useTryOnStore } from '@/stores/useTryOnStore';
import { Button } from '@/components/ui/button';

interface UploadPanelProps {
  onGenerate: () => void;
  isLoading: boolean;
}

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function UploadPanel({ onGenerate, isLoading }: UploadPanelProps) {
  const { personImagePreview, clothingImagePreview, clothingImageUrl } = useTryOnStore();
  const hasPersonImage = !!personImagePreview;
  const hasClothingImage = !!clothingImagePreview || !!clothingImageUrl;
  const canGenerate = hasPersonImage && hasClothingImage && !isLoading;

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <motion.div variants={itemVariants}>
          <PersonUpload />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ClothingUpload />
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="flex justify-center">
        <Button
          onClick={onGenerate}
          disabled={!canGenerate}
          size="lg"
          className={`px-8 py-6 text-base font-semibold rounded-xl transition-all duration-300 ${
            canGenerate
              ? 'gradient-primary text-primary-foreground glow-teal hover:opacity-90'
              : 'bg-secondary text-muted-foreground cursor-not-allowed'
          }`}
        >
          <Sparkles className="h-5 w-5 mr-2" />
          {isLoading ? '准备中...' : '开始换衣'}
        </Button>
      </motion.div>

      {!hasPersonImage && !hasClothingImage && (
        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-muted-foreground"
        >
          上传人物照片和服装图片，AI 将为您生成试穿效果
        </motion.p>
      )}
    </motion.div>
  );
}
