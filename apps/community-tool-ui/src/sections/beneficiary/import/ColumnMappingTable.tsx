import React, { Fragment } from 'react';
import NestedObjectRenderer from './NestedObjectRenderer';
import { isURL, truncatedText } from 'apps/community-tool-ui/src/utils';

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

  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      {rawData.map((item: string, index: number) => {
        const keys = Object.keys(item);

        return (
          <Fragment key={index}>
            <tbody>
              {index === 0 && (
                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  {keys.map((key, i) => {
                    return (
                      <td className="px-4 py-1.5" key={i + 1}>
                        <strong>
                          {truncatedText(key.toLocaleUpperCase(), 10)}
                        </strong>{' '}
                        <br />
                        <select
                          name="targetField"
                          id="targetField"
                          onChange={(e) =>
                            handleTargetFieldChange(key, e.target.value)
                          }
                        >
                          <option value="None">--Choose Field--</option>
                          {uniqueDBFields.map((f: string) => {
                            return (
                              <option
                                key={f}
                                value={f}
                                selected={isTargetInDbFields(f, key)}
                              >
                                {f}
                              </option>
                            );
                          })}
                        </select>
                      </td>
                    );
                  })}
                </tr>
              )}

              <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                {keys.map((key: any, i) => (
                  <td className="px-4 py-1.5" key={i + 1}>
                    {typeof item[key] === 'object' ? (
                      <NestedObjectRenderer object={item[key]} />
                    ) : (
                      renderField(item, key)
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </Fragment>
        );
      })}
    </table>
  );
}
