// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format, isValid, parse } from 'date-fns';

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

export const generateExcel = (
  data: any,
  title: string,
  numberOfColumns: number,
) => {
  const wb = XLSX.utils.book_new();

  const ws = XLSX.utils.json_to_sheet(data);

  const columnWidths = 20;
  ws['!cols'] = Array(numberOfColumns).fill({ wch: columnWidths });

  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  XLSX.writeFile(wb, `${title}.xlsx`);
};

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export const intlFormatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

export const intlDateFormat = (dateStr?: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';

  const day = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(date);
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    date,
  );
  const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(
    date,
  );
  const time = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);

  return `${day} ${month}, ${year}, ${time}`;
};

export function excelDateToJSDate(serial: number): Date {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(excelEpoch.getTime() + serial * 86400000);
}

export function normalizeCell(cell: any) {
  if (typeof cell === 'number' && cell > 20000 && cell < 60000) {
    return format(excelDateToJSDate(cell), 'dd/MM/yyyy');
  }

  // If it's a string that looks like a date
  if (typeof cell === 'string') {
    const parsed =
      parse(cell, 'dd/MM/yyyy', new Date()) ||
      parse(cell, 'dd/MM/yy', new Date());

    if (isValid(parsed)) {
      return format(parsed, 'dd/MM/yyyy');
    }
  }

  // If it's already a JS Date object
  if (cell instanceof Date) {
    return format(cell, 'dd/MM/yyyy');
  }

  return cell;
}
