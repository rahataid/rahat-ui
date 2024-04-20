import { isURL, truncatedText } from 'apps/community-tool-ui/src/utils';
import React, { useState } from 'react';
import NestedObjectRenderer from './NestedObjectRenderer';

interface ColumnMappingTableProps {
  rawData: any[];
  handleTargetFieldChange: (key: string, value: string) => void;
  uniqueDBFields: string[];
  mappings: any[];
}

export default function ColumnMappingTable({
  rawData,
  handleTargetFieldChange,
  uniqueDBFields,
  mappings,
}: ColumnMappingTableProps) {
  const [columns, setColumns] = useState([]) as any[];

  const extractColumns = () => {
    if (rawData.length > 0) {
      const firstItem = rawData[0];
      const keys = Object.keys(firstItem);
      setColumns(keys);
    }
  };

  function isTargetInDbFields(dbField: string, key: string) {
    const found = mappings.find((m) => {
      return m.targetField === dbField && m.sourceField === key;
    });
    if (!found) return false;
    return true;
  }

  function renderField(item: any, key: string) {
    const isUrl = isURL(item[key]);
    if (isUrl)
      return (
        <a className="text-blue-400" href={item[key]} target="_blank">
          Open Link
        </a>
      );
    return item[key];
  }

  React.useEffect(() => {
    extractColumns();
  }, [rawData]);

  const sortedData = uniqueDBFields?.sort() || [];

  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead>
        <tr>
          {columns.map((column: any, index: number) => (
            <th className="px-4 py-1.5" key={index}>
              {truncatedText(column, 50)}
              <br />
              <select
                className="p-2"
                name="targetField"
                id="targetField"
                onChange={(e) =>
                  handleTargetFieldChange(column, e.target.value)
                }
              >
                <option value="None">--Choose Field--</option>
                {sortedData.map((f: string) => {
                  return (
                    <option
                      key={f}
                      value={f}
                      selected={isTargetInDbFields(f, column)}
                    >
                      {f}
                    </option>
                  );
                })}
              </select>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rawData.slice(0, 8).map((item: any, index: number) => (
          <tr
            key={index}
            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
          >
            {columns.map((column: any, columnIndex: number) => (
              <td className="px-4 py-1.5" key={columnIndex}>
                {typeof item[column] === 'object' ? (
                  <NestedObjectRenderer object={item[column]} />
                ) : (
                  renderField(item, column)
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
