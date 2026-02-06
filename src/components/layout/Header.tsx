import { Sparkles, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  const handleReset = () => {
    window.location.reload();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6"
    >
      <div className="flex items-center gap-2.5">
        <div className="gradient-primary rounded-lg p-1.5">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">
          AI <span className="text-gradient-primary">换衣</span>
        </span>
      </div>
      <button
        onClick={handleReset}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <RotateCcw className="h-4 w-4" />
        重新开始
      </button>
    </motion.header>
  );
}
