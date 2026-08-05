import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowBigRight, DownloadCloud, Info, Settings } from 'lucide-react';
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
  uniqueField?: string;
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
  uniqueField,
}: FilterBoxProps) {
  return (
    <>
      <InfoBox title="Load Beneficiary" message="Select your import source" />

      {importSource === IMPORT_SOURCE.EXCEL && (
        <div className="mt-4">
          {uniqueField ? (
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
              <Info size={16} className="mt-0.5 shrink-0 text-blue-500" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1.5">
                  Unique Fields
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {uniqueField.split(',').map((f) => (
                    <span
                      key={f}
                      className="inline-block bg-white border border-blue-300 text-blue-700 rounded-md px-2 py-0.5 font-mono text-xs"
                    >
                      {f.trim()}
                    </span>
                  ))}
                </div>
                <p className="text-blue-600">
                  Rows with duplicate values in these fields will be flagged
                  during validation.{' '}
                  <span className="inline-flex items-center gap-1">
                    To change these, go to{' '}
                    <Settings size={12} className="inline" />
                    <span className="font-medium">
                      Settings → Unique Fields
                    </span>
                    .
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <Info size={16} className="mt-0.5 shrink-0 text-amber-500" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 mb-0.5">
                  No Unique Fields Configured
                </p>
                <p className="text-amber-700">
                  No unique fields are set, so duplicate rows won&apos;t be
                  detected during import.{' '}
                  <span className="inline-flex items-center gap-1">
                    Go to <Settings size={12} className="inline" />
                    <span className="font-medium">
                      Settings → Unique Fields
                    </span>{' '}
                    to configure which fields should be unique.
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

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
        </div>
      )}
    </>
  );
}
