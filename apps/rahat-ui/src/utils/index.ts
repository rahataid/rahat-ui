import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export function truncateEthereumAddress(address: string) {
  if (address.length <= 42) {
    return address;
  }

  const prefixLength = 4; // Keep the first 4 characters
  const suffixLength = 4; // Keep the last 4 characters

  // Extract the prefix and suffix
  const prefix = address.substring(0, prefixLength);
  const suffix = address.substring(address.length - suffixLength);

  // Create the truncated address with ellipsis in between
  const truncatedAddress = `${prefix}....${suffix}`;
  return truncatedAddress;
}

export function formatDate(date: number) {
  const formattedDate = new Date(date * 1000)?.toLocaleDateString('en-GB');
  return formattedDate;
}

export function formatdbDate(date: string) {
  const updated = new Date(date);

  const datePart = updated.toISOString().split('T')[0];

  const timePart = updated.toTimeString().split(' ')[0].slice(0, 5);

  return `${datePart} - ${timePart}`;
}

export function getDayOfWeek(dbDate: string) {
  const date = new Date(dbDate);
  const today = new Date();
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else {
    const dayOfWeek = date.getDay();
    return daysOfWeek[dayOfWeek];
  }
}

export const humanizeString = (inputString: string) => {
  // Replace underscore with space
  inputString = inputString?.replace(/_/g, ' ');

  const words = inputString?.toLowerCase().split(' ');
  // Capitalize the first letter of each word
  for (let i = 0; i < words?.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  const result = words?.join(' ');
  return truncateString(result, 50);
};

function truncateString(inputStr: string, length: number) {
  if (!length) length = 10;
  if (inputStr?.length > length) {
    return inputStr?.slice(0, length) + '...';
  }
  return inputStr;
}

export function humanReadableDate(date: Date) {
  const changedDate = new Date(date);
  const year = changedDate.getFullYear();
  const month = (changedDate.getMonth() + 1).toString().padStart(2, '0');
  const day = changedDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export const exportDataToExcel = (data: any[]) => {
  const currentDate = new Date().getTime();
  const fileName = `Failed_Beneficiary_${currentDate}.xlsx`;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Buffer to store the generated Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  });

  saveAs(blob, fileName);
};

export function formatDT(date: Date) {
  const changedDate = new Date(date);
  const year = changedDate.getFullYear();
  const month = (changedDate.getMonth() + 1).toString().padStart(2, '0');
  const day = changedDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}
