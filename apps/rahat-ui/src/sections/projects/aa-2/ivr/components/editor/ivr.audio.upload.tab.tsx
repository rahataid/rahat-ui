'use client';

import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { useUploadFile } from '@rahat-ui/query';
import { AudioPreviewPlayer } from '../ivr.audio.preview';

type AudioUploadTabProps = {
  onUpdate: (updates: { prompt: string }) => void;
  onUploadingChange?: (pending: boolean) => void;
};

export default function AudioUploadTab({ onUpdate, onUploadingChange }: AudioUploadTabProps) {
  const [pendingUrl, setPendingUrl] = useState('');
  const [pendingName, setPendingName] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFileMutation = useUploadFile();

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPendingUrl(url);
    setPendingName(file.name);
    setPendingFile(file);
    e.target.value = '';
  };

  const handleFileUpload = async () => {
    if (!pendingUrl || !pendingFile) return;
    try {
      const formData = new FormData();
      formData.append('file', pendingFile);
      onUploadingChange?.(true);
      const { data: afterUpload } = await uploadFileMutation.mutateAsync(formData);
      onUploadingChange?.(false);
      onUpdate({ prompt: afterUpload.mediaURL });
      setPendingUrl('');
      setPendingName('');
      setPendingFile(null);
    } catch {
      onUploadingChange?.(false);
      setPendingFile(null);
    }
  };

  const cancelUpload = () => {
    if (pendingUrl) URL.revokeObjectURL(pendingUrl);
    setPendingUrl('');
    setPendingName('');
    setPendingFile(null);
  };

  return (
    <div className="space-y-2">
      {!pendingUrl ? (
        <div
          className="border-2 border-dashed border-muted-foreground/30 rounded-sm p-4 md:p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-6 h-6 md:w-8 md:h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-[clamp(12px,1vw,14px)] text-muted-foreground">
            Click to browse or drag audio file here
          </p>
          <p className="text-[clamp(10px,0.9vw,12px)] text-muted-foreground mt-1">
            MP3, WAV, OGG, WEBM
          </p>
        </div>
      ) : (
        <AudioPreviewPlayer
          src={pendingUrl}
          fileName={pendingName}
          onUpload={handleFileUpload}
          onCancel={cancelUpload}
        />
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileSelected}
      />
    </div>
  );
}
