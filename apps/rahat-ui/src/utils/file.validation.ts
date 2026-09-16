// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { toast } from 'react-toastify';

export const validateFile = (file: File, t?: (key: string) => string) => {
  const maxSize = 5 * 1024 * 1024; // 5 MB
  const validMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/bmp',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'text/csv', // .csv
    'application/pdf', //.pdf
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', //.docx
  ];

  if (file.size > maxSize) {
    toast.error(t ? t('FILE_SIZE_EXCEEDS_5_MB') : 'File size exceeds 5 MB');
    return false;
  }

  if (!validMimeTypes.includes(file.type)) {
    toast.error(t ? t('INVALID_FILE_TYPE') : 'Invalid file type');
    return false;
  }

  return true;
};
