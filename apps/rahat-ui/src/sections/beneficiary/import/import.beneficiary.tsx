'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ChangeEvent, RefObject, useEffect, useState } from 'react';
import { useRumsanService } from '../../../providers/service.provider';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import { useUploadBeneficiary } from '@rahat-ui/query';
import SpinnerLoader from '../../projects/components/spinner.loader';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const DOWNLOAD_FILE_URL = '/files/beneficiary_sample.xlsx';

export default function ImportBeneficiary() {
  const fileInputRef = useRef(null);

  const uploadBeneficiary = useUploadBeneficiary();

  const router = useRouter();
  const t = useTranslations('GLOBAL');

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
      alert(t('INVALID_FILE_FORMAT') || 'Invalid file format. Please upload Excel, JSON, or CSV files.');
      event.target.value = ''; // Clear file input
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast.error(t('PLEASE_SELECT_A_FILE_TO_UPLOAD'));

    // Determine doctype based on file extension
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    const doctype = extension ? allowedExtensions[extension] : '';

    await uploadBeneficiary.mutateAsync({
      selectedFile,
      doctype,
    });
  };

  useEffect(() => {
    if (uploadBeneficiary?.isSuccess) {
      // toast.success('File uploaded successfully.'); commented due to overlap
      router.push('/beneficiary');
    }
    // uploadBeneficiary?.isError && toast.error('File upload unsuccessful.');
  }, [uploadBeneficiary?.isSuccess, uploadBeneficiary?.isError]);

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
        toast.error((t('ERROR_DOWNLOADING_FILE') || 'Error downloading file!') + error);
      });
  };

  return (
    <div className="h-custom">
      <div className="h-full p-2">
        <div className="h-[calc(100vh-240px)] border-2 border-dashed border-primary grid place-items-center bg-card">
          <div className="">
            <div className="mb-2">
              {t('SELECT_BENEFICIARY_FILE_TO_UPDATE') || 'Select beneficiary file to update (Excel, JSON or CSV file)'}
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
            <span>{t('DOWNLOAD_SAMPLE')}</span>
          </button>
          <Button
            className="w-40 mr-2 bg-primary hover:ring-2 ring-primary"
            onClick={() => {
              setSelectedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = null;
            }}
            disabled={selectedFile ? false : true}
          >
            {t('CANCEL_UPLOAD')}
          </Button>

          <Button
            className="w-40 bg-primary hover:ring-2 ring-primary"
            onClick={handleUpload}
            disabled={uploadBeneficiary?.isPending}
          >
            {uploadBeneficiary?.isPending ? <>{t('UPLOADING')}</> : t('UPLOAD_FILE')}
          </Button>
        </div>
      </div>
    </div>
  );
}
