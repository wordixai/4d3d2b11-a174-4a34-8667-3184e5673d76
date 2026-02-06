import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, type LucideIcon } from 'lucide-react';
import { validateImageFile } from '@/lib/image-utils';
import { toast } from 'sonner';

interface ImageDropZoneProps {
  label: string;
  description: string;
  icon: LucideIcon;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  preview: string | null;
  aspectClass?: string;
}

export function ImageDropZone({
  label,
  description,
  icon: Icon,
  onImageSelect,
  onImageRemove,
  preview,
  aspectClass = 'aspect-[3/4]',
}: ImageDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const { valid, error } = validateImageFile(file);
      if (!valid) {
        toast.error(error);
        return;
      }
      onImageSelect(file);
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // reset to allow re-select of same file
    e.target.value = '';
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      <motion.div
        whileHover={{ scale: preview ? 1 : 1.01 }}
        onClick={!preview ? handleClick : undefined}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className={`relative ${aspectClass} rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
          isDragOver
            ? 'drop-zone-active'
            : isHover && !preview
            ? 'drop-zone-hover'
            : 'drop-zone-idle'
        }`}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt={label}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHover ? 1 : 0 }}
              className="absolute inset-0 bg-background/60 flex flex-col items-center justify-center gap-3"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium"
              >
                更换图片
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onImageRemove();
                }}
                className="px-4 py-2 rounded-lg bg-destructive/20 text-destructive text-sm font-medium hover:bg-destructive/30 transition-colors"
              >
                <X className="h-4 w-4 inline mr-1" />
                移除
              </button>
            </motion.div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <motion.div
              animate={isDragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center"
            >
              {isDragOver ? (
                <Upload className="h-6 w-6 text-primary" />
              ) : (
                <Icon className="h-6 w-6 text-primary" />
              )}
            </motion.div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                {isDragOver ? '松开即可上传' : label}
              </p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
