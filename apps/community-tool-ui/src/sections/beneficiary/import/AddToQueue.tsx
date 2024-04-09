import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowBigLeft, ArrowBigUp, CloudDownloadIcon } from 'lucide-react';
import React from 'react';

interface IProps {
  data: any;
  handleRetargetClick: any;
  handleImportClick: any;
  invalidFields: any;
  handleExportInvalidClick: any;
  hasDuplicate: boolean;
}

export default function AddToQueue({
  data,
  handleRetargetClick,
  handleImportClick,
  invalidFields,
  handleExportInvalidClick,
  hasDuplicate,
}: IProps) {
  console.log('Invalid Fields', invalidFields);
  const mappedData =
    data.length > 0
      ? data.map((d: any) => {
          const { rawData, ...rest } = d;
          return rest;
        })
      : []; // Omit rawData
  const headerKeys = mappedData.length > 0 ? Object.keys(mappedData[0]) : [];

  function renderItemKey(item: any, key: string) {
    if (key === 'uuid' || key === 'isDuplicate') {
      return '';
    } else return item[key];
  }

  return (
    <div className="relative mt-5">
      <div className="flex mb-5 justify-between m-2">
        <Button
          onClick={handleRetargetClick}
          className="w-40 bg-secondary hover:ring-2bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        >
          <ArrowBigLeft size={18} strokeWidth={2} /> Re-Target
        </Button>
        <div>
          <Button
            disabled={!invalidFields.length && !hasDuplicate}
            onClick={handleExportInvalidClick}
            className="w-40 mr-2 bg-secondary hover:ring-2bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          >
            <ArrowBigUp size={18} strokeWidth={2} /> Export Invalid
          </Button>

          <Button
            disabled={invalidFields.length || hasDuplicate}
            onClick={handleImportClick}
            className="w-40 bg-primary hover:ring-2 ring-primary py-2 px-4"
          >
            <CloudDownloadIcon size={18} strokeWidth={2} />
            &nbsp; Import Now
          </Button>
        </div>
      </div>
      <hr />
      <div
        style={{ maxHeight: '60vh' }}
        className="overflow-x-auto overflow-y-auto"
      >
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {/* Dynamically generated table headers */}
              {headerKeys.map((key) => (
                <th className="px-4 py-1.5" key={key}>
                  {invalidFields.find(
                    (field: any) => field.fieldName === key,
                  ) ? (
                    <span className="text-red-500">
                      {key === 'uuid' ? '' : key}*
                    </span>
                  ) : key === 'uuid' || key === 'isDuplicate' ? (
                    ''
                  ) : (
                    key
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item: any, index: number) => (
              <tr
                style={{
                  backgroundColor: item.isDuplicate ? 'rgb(254 215 170)' : '',
                }}
                className="bg-red-400 odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                key={index}
              >
                {/* Dynamically generated table cells */}
                {headerKeys.map((key) =>
                  invalidFields.find(
                    (err: any) =>
                      err.uuid === item['uuid'] && err.value === item[key],
                  ) ? (
                    <td className="px-4 bg-red-100 py-1.5" key={key}>
                      {renderItemKey(item, key)}
                    </td>
                  ) : (
                    <td className="px-4 py-1.5" key={key}>
                      {renderItemKey(item, key)}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
