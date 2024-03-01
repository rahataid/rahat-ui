import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import React from 'react';
import {
  ServiceContext,
  ServiceContextType,
} from '../../providers/service.provider';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { EXCEL_FORMAT, FILE_TYPE } from '../../const/excel.format.const';

export default function ImportBeneficiary() {
  const { beneficiaryQuery } = React.useContext(
    ServiceContext
  ) as ServiceContextType;

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const uploadFile = beneficiaryQuery?.useUploadBeneficiaryFile();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUpload = () => {
    const fileExtension = selectedFile && selectedFile?.name?.split('.').pop();
    const isEXCEl = EXCEL_FORMAT.includes(fileExtension as string);
    const docType = isEXCEl ? FILE_TYPE.EXCEL : FILE_TYPE.JSON;
    console.log(docType);
    const formData = new FormData();
    formData.append('file', selectedFile as Blob);
    formData.append('doctype', docType as string);

    uploadFile.mutate(formData);
    console.log(uploadFile);
  };
  return (
    <div className="h-custom">
      <div className="h-full p-2">
        <div className="border-dashed border-2 border-primary w-full py-10 flex justify-center">
          <div>
            <Label htmlFor="file">Select file</Label>
            <Input
              id="file"
              type="file"
              className="cursor-pointer"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="mt-2 flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={selectedFile === null}
            className="flex justify-end"
          >
            {uploadFile.isPending ? 'Loading' : 'Upload'}
          </Button>
        </div>
      </div>
    </div>
  );
}
