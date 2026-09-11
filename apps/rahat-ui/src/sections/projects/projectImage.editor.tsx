'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

type IProps = {
  currentImage?: string | null;
  onFileSelect: (file: File | null) => void;
};

export default function ProjectImageEditor({
  currentImage,
  onFileSelect,
}: IProps) {
  const t = useTranslations('GLOBAL');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const displayImage = preview || currentImage;

  return (
    <div>
      <label className="text-sm font-medium leading-none">
        {t('PROJECT_IMAGE')}
      </label>
      <p className="text-xs text-muted-foreground mt-1">
        {t('UPLOAD_IMAGE_TO_REPRESENT_THIS_PROJECT')}
      </p>
      <div className="flex items-center gap-4 mt-2">
        {displayImage && (
          <Image
            src={displayImage}
            alt={t('PROJECT_IMAGE')}
            width={80}
            height={80}
            className="rounded border object-cover h-20 w-20"
          />
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          {displayImage ? t('CHANGE_IMAGE') : t('CHOOSE_IMAGE')}
        </Button>
      </div>
    </div>
  );
}
