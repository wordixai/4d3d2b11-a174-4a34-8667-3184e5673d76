import { motion } from 'framer-motion';
import { SAMPLE_CLOTHING } from '@/lib/constants';

interface ClothingGalleryProps {
  selectedUrl: string | null;
  onSelect: (url: string) => void;
}

export function ClothingGallery({ selectedUrl, onSelect }: ClothingGalleryProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {SAMPLE_CLOTHING.map((item, index) => (
        <motion.button
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelect(item.imageUrl)}
          className={`relative aspect-[3/4] rounded-lg overflow-hidden transition-all duration-200 ${
            selectedUrl === item.imageUrl
              ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
              : 'hover:ring-1 hover:ring-border'
          }`}
        >
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/80 to-transparent p-2">
            <span className="text-[10px] text-foreground font-medium">{item.name}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
