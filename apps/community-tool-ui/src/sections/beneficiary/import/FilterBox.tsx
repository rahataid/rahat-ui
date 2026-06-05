import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowBigRight, DownloadCloud } from 'lucide-react';
import { IMPORT_OPTIONS, IMPORT_SOURCE } from '../../../constants/app.const';

import ExcelUploader from './ExcelUploader';
import InfoBox from './InfoBox';
import ItemSelector from './ItemSelector';

interface FilterBoxProps {
  form: any;
  importSource: string;
  handleSourceChange: any;
  handleFileSelect: any;
  koboForms: any;
  handleKoboFormChange: any;
  handleGoClick: any;
  rawData: any;
  handleSampleDownload: any;
  loading: boolean;
  // handleUniqueFieldChange: any;
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
  handleSampleDownload,
  loading,
}: FilterBoxProps) {
  return (
    <>
      <InfoBox title="Load Beneficiary" message="Select your import source" />

      <div className="flex mt-10 justify-between m-2 items-center">
        <div className="flex items-center flex-1">
          <ItemSelector
            form={form}
            placeholder="--Select Import Source--"
            id="selectImportForm"
            options={IMPORT_OPTIONS}
            handleItemChange={handleSourceChange}
            defaultData={importSource}
          />
          {importSource === IMPORT_SOURCE.EXCEL && (
            <div className="flex-1 flex justify-end mr-4">
              <Button
                className="ml-4 text-blue-700 bg-gray-300 hover:bg-gray-300 flex items-center"
                onClick={(e) => handleSampleDownload(e)}
              >
                <DownloadCloud size={18} strokeWidth={1.5} className="mr-1" />
                Download Sample
              </Button>
            </div>
          )}
        </div>

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
        <div></div>
        <div>
          {(rawData.length > 0 || importSource === IMPORT_SOURCE.EXCEL) && (
            <Button
              onClick={handleGoClick}
              disabled={loading || rawData.length === 0}
              className="w-40 bg-secondary hover:ring-2bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            >
              <ArrowBigRight size={18} strokeWidth={2} />{' '}
              {loading ? 'Loading...' : 'Go'}
            </Button>
          )}
        </div>
      </div>
      {importSource === IMPORT_SOURCE.EXCEL && (
        <div>
          <ExcelUploader handleFileSelect={handleFileSelect} />
          {/* 
          <Button className=" text-blue-700 bg-gray-300 hover:bg-gray-300 ">
            <DownloadCloud size={18} strokeWidth={1.5} className="mr-1" />
            Download Sample
          </Button> */}
        </div>
      )}
    </>
  );
}
