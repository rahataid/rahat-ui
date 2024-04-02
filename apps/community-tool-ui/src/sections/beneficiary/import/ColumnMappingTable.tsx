import React, { Fragment } from 'react';
import NestedObjectRenderer from './NestedObjectRenderer';
import { truncatedText } from 'apps/community-tool-ui/src/utils';

interface ColumnMappingTableProps {
  rawData: any[];
  handleTargetFieldChange: (key: string, value: string) => void;
  uniqueDBFields: string[];
}

export default function ColumnMappingTable({
  rawData,
  handleTargetFieldChange,
  uniqueDBFields,
}: ColumnMappingTableProps) {
  return (
    <table className="w-full text-sm text-left rtl:text-right">
      {rawData.map((item: string, index: number) => {
        const keys = Object.keys(item);

        return (
          <Fragment key={index}>
            <tbody>
              {index === 0 && (
                <tr>
                  {keys.map((key, i) => {
                    return (
                      <td key={i + 1}>
                        <strong>
                          {truncatedText(key.toLocaleUpperCase(), 15)}
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
                              <option key={f} value={f}>
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

              <tr>
                {keys.map((key: any, i) => (
                  <td key={i + 1}>
                    {typeof item[key] === 'object' ? (
                      <NestedObjectRenderer object={item[key]} />
                    ) : (
                      item[key]
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
