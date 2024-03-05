import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ChangeEvent, useState } from 'react';
import { useRumsanService } from '../../providers/service.provider';
import ConfirmDialog from '../../components/dialog';
import { Alert } from '../../components/alert';

export default function ImportBeneficiary() {
  const { rumsanService } = useRumsanService();
  const [isShowAlert, showAlert] = useState(false);
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

    // Get file extension
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !allowedExtensions[extension]) {
      alert('Invalid file format. Please upload Excel, JSON, or CSV files.');
      event.target.value = ''; // Clear file input
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = () => {
    // Here you can perform upload logic, like sending the file to a server
    if (selectedFile) {
      // Determine doctype based on file extension
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      const doctype = extension ? allowedExtensions[extension] : '';

      // Example: sending file to server using fetch API
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('doctype', doctype);

      //showAlert(true);

      rumsanService.client
        .post('beneficiaries/upload', formData)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          // Handle error
        });
    } else {
      alert('Please select a file to upload.');
    }

    // const showAlert = (messageToShow: string) => {
    //   setMessage(messageToShow);
    //   setShowDialog(true);
    // };

    // const handleCloseDialog = () => {
    //   setShowDialog(false);
    // };
  };

  return (
    <div className="h-custom">
      <Alert
        title="Upload successful"
        message="File has been uploaded successfully"
        show={isShowAlert}
      />
      <div className="h-full p-4">
        <div className="h-[calc(100vh-240px)] border-2 border-dashed border-primary grid place-items-center">
          <div className="">
            <div className='mb-2'>
              Select beneficiary file to update (Excel, JSON or CSV file)
            </div>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
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
