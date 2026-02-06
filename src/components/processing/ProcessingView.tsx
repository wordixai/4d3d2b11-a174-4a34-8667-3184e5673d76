import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { PROCESSING_MESSAGES } from '@/lib/constants';
import { useTryOnStore } from '@/stores/useTryOnStore';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export function ProcessingView() {
  const { processingProgress, setProcessingProgress, reset } = useTryOnStore();
  const [elapsed, setElapsed] = useState(0);

  // Simulated progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingProgress(Math.min(processingProgress + 0.5, 90));
    }, 300);

    return () => clearInterval(interval);
  }, [processingProgress, setProcessingProgress]);

  // Elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentMessage =
    [...PROCESSING_MESSAGES]
      .reverse()
      .find((m) => processingProgress >= m.threshold)?.message || '处理中...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-16 gap-8 max-w-md mx-auto"
    >
      {/* Animated Orb */}
      <div className="relative w-32 h-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, hsl(174, 72%, 46%), transparent, hsl(190, 80%, 50%), transparent, hsl(174, 72%, 46%))',
            opacity: 0.3,
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-3 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(174, 72%, 46%, 0.2), transparent)',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute inset-6 rounded-full bg-card flex items-center justify-center glow-teal"
        >
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </motion.div>
      </div>

      {/* Status */}
      <div className="w-full space-y-4 text-center">
        <motion.p
          key={currentMessage}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-foreground font-medium"
        >
          {currentMessage}
        </motion.p>

        <Progress value={processingProgress} className="h-2" />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{Math.round(processingProgress)}%</span>
          <span>已用时 {elapsed}s</span>
        </div>
      </div>

      {/* Cancel */}
      <Button variant="ghost" onClick={reset} className="text-muted-foreground">
        取消
      </Button>
    </motion.div>
  );
}
