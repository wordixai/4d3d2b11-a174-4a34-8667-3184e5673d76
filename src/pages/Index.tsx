import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { StepIndicator } from '@/components/common/StepIndicator';
import { UploadPanel } from '@/components/upload/UploadPanel';
import { ProcessingView } from '@/components/processing/ProcessingView';
import { ResultView } from '@/components/result/ResultView';
import { useTryOnStore } from '@/stores/useTryOnStore';
import { useStartGeneration, usePollResult } from '@/hooks/useTryOnGeneration';
import { toast } from 'sonner';
import { useEffect } from 'react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const Index = () => {
  const { currentStep, predictionId, setResultImageUrl, setStep, setError, setProcessingProgress } =
    useTryOnStore();
  const generateMutation = useStartGeneration();
  const pollQuery = usePollResult(predictionId);

  // Handle poll results
  useEffect(() => {
    if (!pollQuery.data) return;
    const { status, output, error } = pollQuery.data;

    if (status === 'succeeded' && output) {
      setProcessingProgress(100);
      setTimeout(() => {
        const resultUrl = Array.isArray(output) ? output[0] : output;
        setResultImageUrl(resultUrl);
        setStep('result');
      }, 500);
    }

    if (status === 'failed') {
      setError(error || '生成失败');
      setStep('upload');
      toast.error(error || '生成失败，请重试');
    }
  }, [pollQuery.data, setResultImageUrl, setStep, setError, setProcessingProgress]);

  const handleGenerate = () => {
    generateMutation.mutate();
  };

  return (
    <PageContainer>
      <Header />
      <main className="pt-24 pb-12 px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            AI 智能<span className="text-gradient-primary">换衣</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            上传照片，选择服装，AI 为您一键生成试穿效果
          </p>
        </motion.div>

        {/* Step indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Main content area */}
        <AnimatePresence mode="wait">
          {currentStep === 'upload' && (
            <motion.div key="upload" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <UploadPanel onGenerate={handleGenerate} isLoading={generateMutation.isPending} />
            </motion.div>
          )}
          {currentStep === 'processing' && (
            <motion.div key="processing" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ProcessingView />
            </motion.div>
          )}
          {currentStep === 'result' && (
            <motion.div key="result" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ResultView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="pb-6 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by AI — 虚拟试穿效果仅供参考
        </p>
      </footer>
    </PageContainer>
  );
};

export default Index;
