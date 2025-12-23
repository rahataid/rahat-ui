import {
  FilteredTransaction,
  PROJECT_SETTINGS_KEYS,
  useGetBeneficiariesReport,
  useMutateGraphCall,
  useProjectSettingsStore,
  useReadRahatTokenDecimals,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { dateToTimestamp } from 'apps/rahat-ui/src/utils/dateToTimeStamp';
import { exportToExcel } from 'apps/rahat-ui/src/utils/exportToExcle';
import { transformTransactionData } from 'apps/rahat-ui/src/utils/formatAdlinkTransactionData';
import { UUID } from 'crypto';
import { subWeeks } from 'date-fns';
import { Download, FileSpreadsheet } from 'lucide-react';
import React from 'react';

interface fileDetailsType {
  title: string;
  value: string;
  desc: string;
}
interface IQuickExportReportProps {
  projectUUID: UUID;
  fileExportData: fileDetailsType[];
  contractAddress: string;
}

const QuickExportReport = ({
  projectUUID,
  fileExportData,
  contractAddress,
}: IQuickExportReportProps) => {
  const { mutateAsync, isPending } = useGetBeneficiariesReport();
  const { mutateAsync: graphMutateAsync, isPending: isLoading } =
    useMutateGraphCall(projectUUID);

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[projectUUID]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  const { data: tokenNumber } = useReadRahatTokenDecimals({
    address: contractSettings?.rahattoken?.address,
  });

  const handleQuickDownloadClick = async (value: string) => {
    if (value === 'beneficiaries_data') {
      const today = new Date();
      const oneWeekAgo = subWeeks(today, 1);

      const fromDate = dateFormat(oneWeekAgo, 'yyyy-MM-dd');
      const toDate = dateFormat(today, 'yyyy-MM-dd');

      const result = await mutateAsync({ projectUUID, fromDate, toDate });

      //guard
      if (result.length === 0) return;
      exportToExcel(result, `beneficiaries-report-${fromDate}`);
    }
    // for transaction history report
    else if (value === 'transaction_history') {
      const now = new Date();
      const oneWeekAgo = subWeeks(now, 1);

      const fromDate = dateToTimestamp(oneWeekAgo.toISOString());
      const toDate = dateToTimestamp(now.toISOString());

      const response = await graphMutateAsync({
        query: FilteredTransaction,
        variables: {
          contractAddress,
          fromDate,
          toDate,
          orderBy: 'blockTimestamp',
        },
      });

      //guard
      if (response?.data?.transferProcesseds.length === 0) return;
      const newFormateData = transformTransactionData(
        response?.data?.transferProcesseds,
        Number(tokenNumber),
      );
      exportToExcel(newFormateData, `transaction-history-${fromDate}`);
    }
  };

  return (
    <div>
      {(isPending || isLoading) && (
        <div className="absolute inset-0 bg-gray-300 bg-opacity-30 flex items-center justify-center">
          <Loader />
        </div>
      )}

      <div className="flex gap-1 items-center">
        <Download size={20} className="text-green-500" />
        <p className="text-lg font-semibold">Quick Export</p>
      </div>
      <p className="text-gray-400 text-sm">
        Pre-configured reports for immediate download
      </p>
      <div className="space-y-4 mt-2">
        {fileExportData.map(({ title, value, desc }) => (
          <Card
            key={title}
            className="p-4 rounded-xl flex justify-between gap-4 items-center"
          >
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
            <Button
              variant="outline"
              className="rounded-sm"
              size="sm"
              onClick={() => handleQuickDownloadClick(value)}
            >
              <FileSpreadsheet className="mr-1 h-4 w-4" />
              Excel
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickExportReport;
