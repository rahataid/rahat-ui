import { toast } from 'react-toastify';

export const validateFile = (file: File) => {
  const maxSize = 5 * 1024 * 1024; // 5 MB
  const validMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/bmp',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'text/csv', // .csv
    'application/pdf', //.pdf
  ];

  if (file.size > maxSize) {
    toast.error('File size exceeds 5 MB');
    return false;
  }

  if (!validMimeTypes.includes(file.type)) {
    toast.error('Invalid file type');
    return false;
  }

  return true;
};
