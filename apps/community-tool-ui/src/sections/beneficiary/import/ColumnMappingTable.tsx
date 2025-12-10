import { useBeneficiaryImportStore } from '@rahat-ui/community-query';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  CAMEL_CASE_PRIMARY_FIELDS,
  isURL,
  PRIMARY_FILED_MAP,
  truncatedText,
} from 'apps/community-tool-ui/src/utils';
import React, { useState } from 'react';
import { ComboBox } from './Combobox';

interface ColumnMappingTableProps {
  rawData: any[];
  handleTargetFieldChange: (key: string, value: string) => void;
  fieldDefs: [];
  mappings?: any[];
  aiMappings?: any[];
}

interface IMapping {
  sourceField: string;
  targetField: string;
}

let myMappings: IMapping[] = [];

export const resetMyMappings = () => {
  myMappings = [];
};

export default function ColumnMappingTable({
  rawData,
  handleTargetFieldChange,
  fieldDefs,
}: ColumnMappingTableProps) {
  const [columns, setColumns] = useState([]) as any[];
  const { setMappings, aiSuggestions } = useBeneficiaryImportStore();

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
    if (aiSuggestions && aiSuggestions.length) {
      const aiMatch = aiSuggestions.find((m) => m.sourceField === sourceField);
      if (aiMatch && aiMatch.targetField) {
        return aiMatch.targetField;
      }
    }

    return '';
  }

  function filterUniqueTargetsOnly(arr: IMapping[], key: string) {
    const seen = new Set();
    return arr.filter((item: any) => {
      const keyValue = item[key];
      if (seen.has(keyValue)) {
        return false;
      }
      seen.add(keyValue);
      return true;
    });
  }

  function findFieldName(sourceField: string) {
    const found = fieldDefs.find((f: any) =>
      f.variations.includes(sourceField),
    ) as any;

    if (!found) return null;
    let targetF = found.name;
    const fieldName = found.name.toLowerCase();
    if (CAMEL_CASE_PRIMARY_FIELDS.includes(fieldName)) {
      targetF = PRIMARY_FILED_MAP[fieldName];
    }

    return { sourceField: sourceField, targetField: targetF };
  }

  return (
    <table className="ml-8 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead>
        <tr>
          {columns.map((column: any, index: number) => {
            return (
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
                  aiSuggestions={aiSuggestions}
                />
              </th>
            );
          })}
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
