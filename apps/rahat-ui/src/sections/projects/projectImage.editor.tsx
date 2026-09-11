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
    <div className="rounded border bg-white p-4 mb-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold">Project Image</h2>
        <p className="text-xs text-muted-foreground">
          Upload an image to represent this project.
        </p>
      </div>

      <div className="flex items-center gap-4">
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
