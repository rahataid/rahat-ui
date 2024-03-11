import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ChangeEvent, RefObject, useState } from 'react';
import { useRumsanService } from '../../providers/service.provider';
import { toast } from 'react-toastify';
import { useRef } from 'react';

const DOWNLOAD_FILE_URL = '/files/beneficiary_sample.xlsx';

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
          `${res.data.data.count} Beneficiaries uploaded successfully!`
        );
      })
      .catch((error) => {
        toast.error('Error uploading file!');
      });
  };

  const handleDownloadClick = () => {
    fetch(DOWNLOAD_FILE_URL)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'beneficiary_sample.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        toast.error('Error downloading file!' + error);
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
          <button
            onClick={handleDownloadClick}
            className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <svg
              className="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            <span>Download Sample</span>
          </button>

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
