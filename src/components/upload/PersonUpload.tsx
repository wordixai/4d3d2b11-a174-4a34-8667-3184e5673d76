import { User } from 'lucide-react';
import { ImageDropZone } from './ImageDropZone';
import { useTryOnStore } from '@/stores/useTryOnStore';

export function PersonUpload() {
  const { personImagePreview, setPersonImage } = useTryOnStore();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">人物照片</h3>
      <ImageDropZone
        label="上传您的照片"
        description="拖拽或点击上传全身照"
        icon={User}
        onImageSelect={(file) => setPersonImage(file)}
        onImageRemove={() => setPersonImage(null)}
        preview={personImagePreview}
        aspectClass="aspect-[3/4]"
      />
      <p className="text-xs text-muted-foreground text-center">
        建议使用清晰的正面全身照
      </p>
    </div>
  );
}
