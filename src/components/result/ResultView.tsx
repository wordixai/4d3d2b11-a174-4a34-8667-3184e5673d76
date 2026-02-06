import { Download, RotateCcw, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { useTryOnStore } from '@/stores/useTryOnStore';
import { downloadImage } from '@/lib/image-utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ResultView() {
  const { personImagePreview, resultImageUrl, reset } = useTryOnStore();

  if (!resultImageUrl || !personImagePreview) return null;

  const handleDownload = async () => {
    await downloadImage(resultImageUrl, `ai-tryon-${Date.now()}.png`);
    toast.success('图片已下载');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(resultImageUrl);
      toast.success('链接已复制到剪贴板');
    } catch {
      toast.error('复制失败');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 max-w-lg mx-auto"
    >
      <BeforeAfterSlider
        beforeImage={personImagePreview}
        afterImage={resultImageUrl}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-3"
      >
        <Button
          onClick={handleDownload}
          className="gradient-primary text-primary-foreground hover:opacity-90"
        >
          <Download className="h-4 w-4 mr-2" />
          下载
        </Button>
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          再试一次
        </Button>
        <Button variant="ghost" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          分享
        </Button>
      </motion.div>
    </motion.div>
  );
}
