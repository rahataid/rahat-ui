import { useAddBulkFile } from '@rahat-ui/community-query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

type IProps = {
  handleTabChange: (tab: 'add' | 'import') => void;
};

export default function ExcelUploader({ handleTabChange }: IProps) {
  const addBulk = useAddBulkFile();
  const [importFile, setImportFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImportFile(file);
    }
  };

  const handleImportFile = () => {
    if (importFile) {
      const formData = new FormData();
      formData.append('file', importFile);

      addBulk.mutateAsync({ file: formData });
      setImportFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    if (addBulk?.data?.response?.success) {
      setImportFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [addBulk?.data?.response?.success]);

  return (
    <>
      <div className="h-[calc(20vh-5px)] border-2 border-dashed border-secondary grid place-items-center">
        <div className="mt-2">
          <div className="mb-2 p-2">
            Select file to upload (Excel or CSV file)
          </div>
          <Input
            ref={fileInputRef}
            onChange={handleFileSelect}
            id="file"
            type="file"
            className="cursor-pointer w-auto rounded"
          />
        </div>
      </div>
      <div className="flex justify-end mt-6 space-x-4 mr-5">
        <Button onClick={() => handleTabChange('add')}>Go Back</Button>
        <Button onClick={handleImportFile} disabled={!importFile}>
          Upload Now
        </Button>
      </div>
    </>
  );
}
