import { Check, Upload, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TryOnStep } from '@/stores/useTryOnStore';
import { STEPS } from '@/lib/constants';

const iconMap = {
  Upload,
  Cpu,
  Check,
};

interface StepIndicatorProps {
  currentStep: TryOnStep;
}

const stepOrder: TryOnStep[] = ['upload', 'processing', 'result'];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, index) => {
        const Icon = iconMap[step.icon as keyof typeof iconMap];
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;

        return (
          <div key={step.id} className="flex items-center gap-2">
            {index > 0 && (
              <div className="w-8 sm:w-12 h-px relative overflow-hidden">
                <div className="absolute inset-0 bg-border" />
                {isCompleted && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 gradient-primary origin-left"
                  />
                )}
              </div>
            )}
            <motion.div
              animate={{
                scale: isActive ? 1.05 : 1,
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                isActive
                  ? 'gradient-primary text-primary-foreground'
                  : isCompleted
                  ? 'bg-primary/20 text-primary'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{step.label}</span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
