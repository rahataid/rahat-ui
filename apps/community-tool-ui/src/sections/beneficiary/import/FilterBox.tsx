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
import InfoBox from './InfoBox';

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
      <InfoBox title="Load Beneficiary" message="Select your import source" />

      <div className="flex mt-10 justify-between m-2">
        <ItemSelector
          form={form}
          placeholder="--Select Import Source--"
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
              placeholder="--Select Kobotool Form--"
              id="koboForm"
              options={koboForms}
            />
          )}
        </div>
        <div>
          {/* <ItemSelector
            form={form}
            placeholder="--Beneficiary Unique Identifier--"
            id="selectUniqueField"
            options={UNIQUE_FIELD_OPTIONS}
            defaultData={selectedUniqueField}
            handleItemChange={handleUniqueFieldChange}
          /> */}
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
