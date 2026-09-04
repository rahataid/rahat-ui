'use client';

import { useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import Image from 'next/image';
import { useUploadFile, useProjectImageUpdate } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

type IProps = {
  currentImage?: string | null;
};

export default function ProjectImageEditor({ currentImage }: IProps) {
  const { id } = useParams();
  const projectUUID = id as UUID;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const uploadFile = useUploadFile();
  const updateProjectImage = useProjectImageUpdate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    uploadFile.mutate(formData, {
      onSuccess: (res) => {
        const url = res?.data?.mediaURL;
        if (!url) return;
        updateProjectImage.mutate(
          { uuid: projectUUID, url },
          {
            onSuccess: () => {
              setSelectedFile(null);
            },
          },
        );
      },
    });
  };

  const isPending = uploadFile.isPending || updateProjectImage.isPending;
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
          disabled={isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          {currentImage || preview ? 'Change Image' : 'Choose Image'}
        </Button>
        {selectedFile && (
          <Button type="button" disabled={isPending} onClick={handleSubmit}>
            {isPending ? 'Submitting...' : 'Submit'}
          </Button>
        )}
      </div>
    </div>
  );
}
