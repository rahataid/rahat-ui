import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { isURL, truncatedText } from 'apps/community-tool-ui/src/utils';
import React, { useState } from 'react';
import { ComboBox } from './Combobox';
import { useBeneficiaryImportStore } from '@rahat-ui/community-query';

interface ColumnMappingTableProps {
  rawData: any[];
  handleTargetFieldChange: (key: string, value: string) => void;
  fieldDefs: [];
  mappings: any[];
}

const myMappings = [] as any;

export default function ColumnMappingTable({
  rawData,
  handleTargetFieldChange,
  fieldDefs,
  mappings,
}: ColumnMappingTableProps) {
  const [columns, setColumns] = useState([]) as any[];
  const { setMappings } = useBeneficiaryImportStore();

  const extractColumns = () => {
    if (rawData.length > 0) {
      const firstItem = rawData[0];
      const keys = Object.keys(firstItem);
      setColumns(keys);
    }
  };

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

  const fieldNameOnly = fieldDefs.length
    ? fieldDefs.map((f: any) => f.name)
    : [];

  const uniqueDBFields = [...new Set(fieldNameOnly)];

  const sortedData = uniqueDBFields.sort() || [];

  function getSelectedField(sourceField: string) {
    if (mappings.length) {
      const found = mappings.find((m) => {
        return m.sourceField === sourceField;
      });
      if (!found) return '';
      return found.targetField;
    } else {
      // Search for match
      const found = findFieldName(sourceField);
      if (!found) return '';
      myMappings.push({
        sourceField: found.sourceField,
        targetField: found.targetField,
      });
      const filtered = filterUniqueTargetsOnly(myMappings, 'targetField');
      setMappings(filtered);
      return found.targetField;
    }
  }

  function filterUniqueTargetsOnly(arr: [], key: string) {
    const seen = new Set();
    return arr.filter((item) => {
      const keyValue = item[key];
      if (seen.has(keyValue)) {
        return false;
      }
      seen.add(keyValue);
      return true;
    });
  }

  function findFieldName(inputField: string) {
    const normalizedInput = inputField.toLowerCase().trim();

    const field = fieldDefs.find((field: any) =>
      field.variations.some(
        (v: any) => v.toLowerCase().trim() === normalizedInput,
      ),
    ) as any;

    return field ? { sourceField: inputField, targetField: field.name } : null;
  }

  return (
    <table className="ml-8 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead>
        <tr>
          {columns.map((column: any, index: number) => (
            <th className="py-1.5" key={index}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>{truncatedText(column, 40)}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{column}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <ComboBox
                data={sortedData}
                handleTargetFieldChange={handleTargetFieldChange}
                column={column}
                selectedField={getSelectedField(column)}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rawData.slice(0, 10).map((item: any, index: number) => (
          <tr
            key={index}
            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
          >
            {columns.map((column: any, columnIndex: number) => (
              <td className="px-2 py-1.5" key={columnIndex}>
                {typeof item[column] === 'object'
                  ? ''
                  : renderField(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
