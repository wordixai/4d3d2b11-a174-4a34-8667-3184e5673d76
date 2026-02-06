import { useState } from 'react';
import { Shirt } from 'lucide-react';
import { ImageDropZone } from './ImageDropZone';
import { ClothingGallery } from './ClothingGallery';
import { useTryOnStore } from '@/stores/useTryOnStore';

type TabValue = 'upload' | 'gallery';

export function ClothingUpload() {
  const [activeTab, setActiveTab] = useState<TabValue>('upload');
  const { clothingImagePreview, clothingImageUrl, setClothingImage, setClothingImageUrl } =
    useTryOnStore();

  const previewUrl = clothingImagePreview || clothingImageUrl;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">选择服装</h3>

      {/* Tab switcher */}
      <div className="flex rounded-lg bg-secondary p-1 gap-1">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 text-sm py-1.5 rounded-md transition-colors font-medium ${
            activeTab === 'upload'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          上传
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 text-sm py-1.5 rounded-md transition-colors font-medium ${
            activeTab === 'gallery'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          服装库
        </button>
      </div>

      {activeTab === 'upload' ? (
        <ImageDropZone
          label="上传服装图片"
          description="拖拽或点击上传服装照片"
          icon={Shirt}
          onImageSelect={(file) => setClothingImage(file)}
          onImageRemove={() => setClothingImage(null)}
          preview={previewUrl}
          aspectClass="aspect-[3/4]"
        />
      ) : (
        <ClothingGallery
          selectedUrl={clothingImageUrl}
          onSelect={(url) => {
            setClothingImage(null);
            setClothingImageUrl(url);
          }}
        />
      )}

      <p className="text-xs text-muted-foreground text-center">
        纯色背景的服装图片效果最佳
      </p>
    </div>
  );
}
