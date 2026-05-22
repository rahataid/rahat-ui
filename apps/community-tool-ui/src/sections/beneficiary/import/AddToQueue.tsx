import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  humanizeString,
  truncatedText,
} from 'apps/community-tool-ui/src/utils';
import { ArrowBigLeft, ArrowBigUp, CloudDownloadIcon } from 'lucide-react';

interface IProps {
  data: any;
  handleRetargetClick: any;
  handleImportClick: any;
  invalidFields: any;
  handleExportInvalidClick: any;
  hasUUID: boolean;
  loading: boolean;
}

export default function AddToQueue({
  data,
  handleRetargetClick,
  handleImportClick,
  invalidFields,
  handleExportInvalidClick,
  hasUUID,
  loading,
}: IProps) {
  const mappedData =
    data.length > 0
      ? data.map((d: any) => {
        const { rawData, ...rest } = d;
        return rest;
      })
      : [];

  const headerKeys = mappedData.length > 0 ? Object.keys(mappedData[0]) : [];

  function renderItemKey(item: any, key: string) {
    if (key === 'isDuplicate') {
      return '';
    }

    return item[key];
  }

  const hasDuplicates = data.some((item: any) => item.isDuplicate);

  const enableDisableImportButton = () => {
    if (hasUUID) return false;

    if (invalidFields.length || hasDuplicates) return true;

    if (loading) return true;

    return false;
  };

  return (
    <div className="relative mt-5">
      <div className="flex mb-5 justify-between m-2">
        <Button
          onClick={handleRetargetClick}
          className="w-40 bg-secondary hover:ring-2bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        >
          <ArrowBigLeft size={18} strokeWidth={2} /> Back
        </Button>

        <div>
          <Button
            disabled={!invalidFields.length && !hasDuplicates}
            onClick={handleExportInvalidClick}
            className="w-40 mr-2 bg-secondary hover:ring-2bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          >
            <ArrowBigUp size={18} strokeWidth={2} /> Export Invalid
          </Button>

          <Button
            disabled={enableDisableImportButton()}
            onClick={handleImportClick}
            className="w-40 bg-primary hover:ring-2 ring-primary py-2 px-4"
          >
            <CloudDownloadIcon size={18} strokeWidth={2} />
            &nbsp; Import Valid
          </Button>
        </div>
      </div>

      <hr />

      <div className="table-wrp block h-screen import-container overflow-x-auto">
        <table className="ml-2 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="bg-white border-b sticky top-0">
            <tr>
              {headerKeys.map((key) => (
                <th
                  style={{ minWidth: 150 }}
                  className="px-2 py-1"
                  key={key}
                >
                  {invalidFields.find(
                    (field: any) => field.fieldName === key,
                  ) ? (
                    <span className="text-red-500">
                      {truncatedText(humanizeString(key), 40)}*
                    </span>
                  ) : key === 'isDuplicate' ? (
                    ''
                  ) : (
                    truncatedText(humanizeString(key), 40)
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="h-screen overflow-y-auto">
            {data.map((item: any, index: number) => (
              <tr
                key={index}
                className={`${item.isDuplicate
                  ? 'bg-orange-100 border-b'
                  : 'odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'
                  }`}
              >
                {headerKeys.map((key) => {
                  const errorData = invalidFields.find(
                    (err: any) =>
                      err.uuid === item['uuid'] &&
                      err.value === item[key] &&
                      key === err.fieldName,
                  );

                  const isInvalid = !!errorData;

                  const cellContent = renderItemKey(item, key);

                  // DUPLICATE + INVALID
                  if (item.isDuplicate && isInvalid) {
                    return (
                      <td
                        className="px-4 py-1.5 bg-red-100"
                        key={key}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-full h-full cursor-pointer">
                                {cellContent}
                              </div>
                            </TooltipTrigger>

                            <TooltipContent align="start">
                              <div className="space-y-1">
                                <p>This row is duplicate!</p>
                                <p>{errorData?.message}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    );
                  }

                  // INVALID STATUS
                  if (isInvalid) {
                    return (
                      <td
                        className="px-4 py-1.5 bg-red-100"
                        key={key}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-full h-full cursor-pointer">
                                {cellContent}
                              </div>
                            </TooltipTrigger>

                            <TooltipContent align="start">
                              <p>{errorData?.message}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    );
                  }

                  // DUPLICATE ROW
                  if (item.isDuplicate) {
                    return (
                      <td
                        className="px-4 py-1.5"
                        key={key}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-full h-full cursor-pointer">
                                {cellContent}
                              </div>
                            </TooltipTrigger>

                            <TooltipContent align="start">
                              <p>This row is duplicate!</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    );
                  }

                  // NORMAL CELL
                  return (
                    <td
                      className="px-4 py-1.5"
                      key={key}
                    >
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}