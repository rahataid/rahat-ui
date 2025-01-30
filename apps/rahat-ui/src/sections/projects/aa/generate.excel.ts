// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import * as XLSX from 'xlsx';

export const generateExcel = (data: any, title: string, numberOfColumns: number) => {
    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(data);

    const columnWidths = 20;
    ws['!cols'] = Array(numberOfColumns).fill({ wch: columnWidths });

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, `${title}.xlsx`);
};