import React from 'react';
import ItemSelector from './ItemSelector';
import {
  IMPORT_OPTIONS,
  IMPORT_SOURCE,
  UNIQUE_FIELD_OPTIONS,
} from '../../../constants/app.const';
import ExcelUploader from './ExcelUploader';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowBigRight } from 'lucide-react';

interface FilterBoxProps {
  form: any;
  importSource: string;
  handleSourceChange: any;
  handleFileSelect: any;
  koboForms: any;
  handleKoboFormChange: any;
  handleGoClick: any;
  rawData: any;
  selectedUniqueField: string;
  handleUniqueFieldChange: any;
}

export default function FilterBox({
  form,
  importSource,
  handleSourceChange,
  handleFileSelect,
  koboForms,
  handleKoboFormChange,
  handleGoClick,
  rawData,
  selectedUniqueField,
  handleUniqueFieldChange,
}: FilterBoxProps) {
  return (
    <>
      <div
        className="bg-blue-100 border-t-4 border-blue-400 rounded-b text-blue-900 px-4 py-3 shadow-md"
        role="alert"
      >
        <div className="flex">
          <div className="py-1">
            <svg
              className="fill-current h-6 w-6 text-blue-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
            </svg>
          </div>
          <div>
            <p className="font-bold">Import Beneficiary</p>
            <p className="text-sm">
              Select EMAIL or PHONE as an unique ID to avoid duplicate import.
            </p>
          </div>
        </div>
      </div>

      <div className="m-5"></div>

      <div className="flex justify-between m-2">
        <ItemSelector
          form={form}
          placeholder="--Select Import Source"
          id="selectImportForm"
          options={IMPORT_OPTIONS}
          handleItemChange={handleSourceChange}
          defaultData={importSource}
        />

        <div>
          {importSource === IMPORT_SOURCE.KOBOTOOL && (
            <ItemSelector
              handleItemChange={handleKoboFormChange}
              form={form}
              placeholder="--Select Form--"
              id="koboForm"
              options={koboForms}
            />
          )}
        </div>
        <div>
          <ItemSelector
            form={form}
            placeholder="--Select Unique Field--"
            id="selectUniqueField"
            options={UNIQUE_FIELD_OPTIONS}
            defaultData={selectedUniqueField}
            handleItemChange={handleUniqueFieldChange}
          />
        </div>
        <div>
          {rawData.length > 0 && (
            <Button
              onClick={handleGoClick}
              className="w-40 bg-secondary hover:ring-2bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            >
              <ArrowBigRight size={18} strokeWidth={2} /> Go
            </Button>
          )}
        </div>
      </div>
      {importSource === IMPORT_SOURCE.EXCEL && (
        <ExcelUploader handleFileSelect={handleFileSelect} />
      )}
    </>
  );
}
