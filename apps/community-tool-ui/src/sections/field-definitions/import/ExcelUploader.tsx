import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import React, { useState } from 'react';

type Irops = {
  handleTabChange: (tab: 'add' | 'import') => void;
};

export default function ExcelUploader({ handleTabChange }: Irops) {
  const [importFile, setImportFile] = useState<File | null>(null);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || [];
    const fileName = files[0];
    setImportFile(fileName);
  };

  const handleImportFile = () => {
    console.log(importFile);
  };
  return (
    <>
      <div className="h-[calc(20vh-5px)] border-2 border-dashed border-secondary grid place-items-center">
        <div className="mt-2">
          <div className="mb-2 p-2">
            Select file to upload (Excel or CSV file)
          </div>
          <Input
            onChange={handleFileSelect}
            id="file"
            type="file"
            className="cursor-pointer w-auto rounded"
          />
        </div>
      </div>
      <div className="flex justify-end mt-6 space-x-4 mr-5">
        <Button onClick={() => handleTabChange('add')}>Add </Button>
        <Button onClick={() => handleImportFile()}>Import</Button>
      </div>
    </>
  );
}
