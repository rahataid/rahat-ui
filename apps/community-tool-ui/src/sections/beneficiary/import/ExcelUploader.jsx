import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import React from 'react';

export default function ExcelUploader({ handleFileSelect }) {
  return (
    <div className="h-[calc(20vh-5px)] border-2 border-dashed border-secondary grid place-items-center">
      <div className="">
        <div className="mb-2">Select file to upload (Excel or CSV file)</div>
        <Input
          onChange={handleFileSelect}
          id="file"
          type="file"
          className="cursor-pointer w-auto rounded"
        />
      </div>
    </div>
  );
}
