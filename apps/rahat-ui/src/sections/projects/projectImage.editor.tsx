'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

type IProps = {
  currentImage?: string | null;
  onFileSelect: (file: File | null) => void;
};

export default function ProjectImageEditor({
  currentImage,
  onFileSelect,
}: IProps) {
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
        Project Image
      </label>
      <div className="flex items-center gap-4 mt-2">
        {displayImage && (
          <Image
            src={displayImage}
            alt="Project"
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
          {displayImage ? 'Change Image' : 'Choose Image'}
        </Button>
      </div>
    </div>
  );
}
