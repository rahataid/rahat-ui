import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ChangeEvent, RefObject, useState } from 'react';
import { useRumsanService } from '../../providers/service.provider';
import { toast } from 'react-toastify';
import { useRef } from 'react';

export default function ImportBeneficiary() {
  const fileInputRef: RefObject<HTMLInputElement> = useRef(null);

  const resetFileInput = () => {
    // Resetting the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const { rumsanService } = useRumsanService();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const allowedExtensions: { [key: string]: string } = {
    xlsx: 'excel',
    xls: 'excel',
    json: 'json',
    csv: 'csv',
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !allowedExtensions[extension]) {
      alert('Invalid file format. Please upload Excel, JSON, or CSV files.');
      event.target.value = ''; // Clear file input
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return toast.error('Please select a file to upload');

    // Determine doctype based on file extension
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    const doctype = extension ? allowedExtensions[extension] : '';

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('doctype', doctype);

    rumsanService.client
      .post('beneficiaries/upload', formData)
      .then((res) => {
        setSelectedFile(null);
        resetFileInput();
        toast.success(
          `${res.data.data.count} Beneficiaries uploaded successfully!`,
        );
      })
      .catch((error) => {
        toast.error('Error uploading file!');
      });
  };

  return (
    <div className="h-custom">
      <div className="h-full p-4">
        <div className="h-[calc(100vh-240px)] border-2 border-dashed border-primary grid place-items-center">
          <div className="">
            <div className="mb-2">
              Select beneficiary file to update (Excel, JSON or CSV file)
            </div>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="cursor-pointer w-auto rounded"
            />
          </div>
        </div>
        <div className="flex justify-end w-full mt-4">
          <Button
            className="w-40 bg-primary hover:ring-2 ring-primary"
            onClick={handleUpload}
          >
            Upload File
          </Button>
        </div>
      </div>
    </div>
  );
}
