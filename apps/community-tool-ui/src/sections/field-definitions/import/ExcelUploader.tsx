import { useAddBulkFile } from '@rahat-ui/community-query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { DownloadCloud } from 'lucide-react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import Samples from '../samples.json';

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

  const handleSampleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(Samples);

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'FieldDefinitionSamples.xlsx');
  };

  return (
    <>
      <div className="h-[calc(20vh-5px)] border-2 border-dashed border-secondary grid place-items-center">
        <div className="mt-2">
          <div className="mb-2 p-2">
            Select file to upload (Excel or CSV file)
          </div>
          <Input
            accept=".xlsx, .csv"
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
        <Button
          onClick={handleSampleDownload}
          className=" text-blue-700 bg-gray-300 hover:bg-gray-300 "
        >
          <DownloadCloud size={18} strokeWidth={1.5} className="mr-1" />
          Download Sample
        </Button>
        <Button onClick={handleImportFile} disabled={!importFile}>
          Upload Now
        </Button>
      </div>
    </>
  );
}
