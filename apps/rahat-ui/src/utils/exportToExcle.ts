import * as XLSX from 'xlsx';
import { capitalizeHeader } from './capitalizeHeader';

export const exportToExcel = async (data: any[], fileName: string) => {
  // Format the data with new headers
  const formattedData = data.map((item) => {
    const newItem: any = {};
    Object.keys(item).forEach((key) => {
      const newKey = capitalizeHeader(key);
      newItem[newKey] = item[key];
    });
    return newItem;
  });

  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
