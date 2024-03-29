import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowBigLeft } from 'lucide-react';
import React from 'react';

interface IProps {
  data: any;
  handleRetargetClick: any;
  handleImportClick: any;
  invalidFields: any;
}

export default function AddToQueue({
  data,
  handleRetargetClick,
  handleImportClick,
  invalidFields,
}: IProps) {
  const mappedData =
    data.length > 0
      ? data.map((d: any) => {
          const { rawData, ...rest } = d;
          return rest;
        })
      : []; // Omit rawData
  const keys = mappedData.length > 0 ? Object.keys(mappedData[0]) : [];

  return (
    <div className="relative mt-5">
      <div className="flex mb-5 justify-between m-2">
        <Button
          onClick={handleRetargetClick}
          className="w-40 bg-secondary hover:ring-2bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        >
          <ArrowBigLeft size={18} strokeWidth={2} /> Re-Target
        </Button>
        <Button
          disabled={invalidFields.length}
          onClick={handleImportClick}
          className="w-40 bg-primary hover:ring-2 ring-primary"
        >
          Import Now
        </Button>
      </div>
      <hr />
      <div className="overflow-x-auto overflow-y-auto">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead>
            <tr>
              {/* Dynamically generated table headers */}
              {keys.map((key) => (
                <th className="pt-2 pb-2" key={key}>
                  {key.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item: any, index: number) => (
              <tr key={index}>
                {/* Dynamically generated table cells */}
                {keys.map((key) => (
                  <td key={key}>{item[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
