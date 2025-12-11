import React from 'react';
import { getCellColor } from './utils/getPeriodDataCellColor';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
interface IGlofasPeriodDataTableProps {
  headerData: string[];
  bodyData: string[][];
  title: string;
}

const GlofasPeriodDataTable = ({
  headerData,
  bodyData,
  title,
}: IGlofasPeriodDataTableProps) => {
  if (!headerData && !bodyData) {
    return;
  }

  return (
    <div className="bg-card p-4 rounded-sm border shadow mt-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-semibold text-lg">{title}</h1>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              {headerData?.map((header: string, index: number) => (
                <th
                  className="p-2 border border-gray-300 bg-gray-100 text-center text-xs font-semibold text-gray-600"
                  key={index}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyData?.map((row: string[], rowIndex: number) => (
              <tr key={rowIndex}>
                {row.map((cell: string, cellIndex: number) => {
                  if (cellIndex === 0) {
                    return (
                      <td
                        className={`p-2 border border-gray-200 text-center text-sm text-gray-700`}
                        key={cellIndex}
                      >
                        {dateFormat(cell, 'MMM dd, yyyy')}
                      </td>
                    );
                  }

                  const bgColor = getCellColor(cell);
                  return (
                    <td
                      className={`p-2 border border-gray-200 text-center text-sm text-gray-700 ${bgColor}`}
                      key={cellIndex}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GlofasPeriodDataTable;
