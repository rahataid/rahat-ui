import * as XLSX from 'xlsx';
import { mapTopic } from './const';

export const generateExcel = (data: any, title: string, uiConfig: any) => {
  // Extract all dataMap values from the UI configuration
  const dataMaps = new Set();
  uiConfig.forEach((section: any) => {
    section.fields.forEach((field: any) => {
      if (field.dataMap) {
        dataMaps.add(field.dataMap);
      }
    });
  });

  // Filter data that matches the extracted dataMaps
  const filteredData = data.filter((item: any) => dataMaps.has(item.name));

  // Process data into a structured format
  const processedData: any = [];

  filteredData.forEach((item: any) => {
    console.log(item.data);

    if (Array.isArray(item.data)) {
      item.data.forEach((entry: any) => {
        processedData.push({
          Category: mapTopic(item.name?.split('_ID')[0]),
          ID: mapTopic(entry.id) || 'N/A',
          Count: entry.count || 0,
        });
      });
    } else if (typeof item.data === 'object' && item.data !== null) {
      processedData.push({
        Category: item.name?.split('_ID')[0],
        ID: 'N/A',
        Count: item.data.count || 0,
      });
    } else {
      processedData.push({
        Category: item.name?.split('_ID')[0],
        ID: 'N/A',
        Count: item.data,
      });
    }
  });

  // Create an Excel file
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(processedData);

  // Set column widths
  ws['!cols'] = [
    { wch: 50 }, // Category column width
    { wch: 20 }, // ID column width
    { wch: 15 }, // Count column width
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Report');
  XLSX.writeFile(wb, `${title}.xlsx`);
};
