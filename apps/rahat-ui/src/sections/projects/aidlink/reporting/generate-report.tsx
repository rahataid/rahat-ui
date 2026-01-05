import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { DatePicker } from 'apps/rahat-ui/src/components/datePicker';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  FilteredTransaction,
  PROJECT_SETTINGS_KEYS,
  useGetBeneficiariesReport,
  useMutateGraphCall,
  useProjectSettingsStore,
  useReadRahatTokenDecimals,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { exportToExcel } from 'apps/rahat-ui/src/utils/exportToExcle';
import { dateToTimestamp } from 'apps/rahat-ui/src/utils/dateToTimeStamp';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import { transformTransactionData } from 'apps/rahat-ui/src/utils/formatAdlinkTransactionData';

interface fileDetailsType {
  title: string;
  value: string;
  desc: string;
}

interface IGenerateReportProps {
  projectUUID: UUID;
  fileExportData: fileDetailsType[];
  contractAddress: string;
}

const formSchema = z
  .object({
    reportType: z.string({
      required_error: 'Please select a report type',
    }),
    startDate: z.date({
      required_error: 'Start date is required',
    }),
    endDate: z.date({
      required_error: 'End date is required',
    }),
  })
  // Ensure startDate <= endDate
  .refine((data) => data.startDate <= data.endDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
  // Ensure startDate is not in the future
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // strip time for comparison
      return data.startDate <= today;
    },
    {
      message: 'Start date cannot be in the future',
      path: ['startDate'],
    },
  )
  // Ensure endDate is not in the future
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // strip time for comparison
      return data.endDate <= today;
    },
    {
      message: 'End date cannot be in the future',
      path: ['endDate'],
    },
  );

type FormValues = z.infer<typeof formSchema>;

const GenerateReport = ({
  projectUUID,
  fileExportData,
  contractAddress,
}: IGenerateReportProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync, isPending } = useGetBeneficiariesReport();
  const { mutateAsync: graphMutateAsync, isPending: isLoading } =
    useMutateGraphCall(projectUUID);

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[projectUUID]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  const { data: tokenNumber } = useReadRahatTokenDecimals({
    address: contractSettings?.rahattoken?.address,
  });

  const onSubmit = async (data: FormValues) => {
    // for beneficiaries data report
    if (data?.reportType === 'beneficiaries_data') {
      const fromDate = dateFormat(data.startDate, 'yyyy-MM-dd');
      const toDate = dateFormat(data.endDate, 'yyyy-MM-dd');
      const result = await mutateAsync({ projectUUID, fromDate, toDate });

      //guard
      if (result.length === 0) return;
      exportToExcel(result, `beneficiaries-report-${fromDate}`);
    }
    // for transaction history report
    else if (data?.reportType === 'transaction_history') {
      const fromDate = dateToTimestamp(data.startDate.toISOString());
      const toDate = dateToTimestamp(data.endDate.toISOString());
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

      // Handle transaction history report generation
    } else if (data?.reportType === 'offramped_transaction') {
      // Handle offramped transaction report generation
    }
  };

  return (
    <>
      {(isPending || isLoading) && (
        <div className="absolute inset-0 bg-gray-300 bg-opacity-30 flex items-center justify-center">
          <Loader />
        </div>
      )}

      <Card className="p-4 col-span-2 lg:col-span-1 rounded-xl">
        <div className="flex gap-1 items-center">
          <FileText size={20} className="text-blue-500" />
          <p className="text-lg font-semibold">Generate Report</p>
        </div>
        <p className="text-gray-400 text-sm">
          Configure and export your project data
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div>
            <h3 className="font-medium text-gray-600">Report Type</h3>
            <Controller
              name="reportType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange}>
                  <SelectTrigger
                    className={errors.reportType ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {fileExportData.map((item) => (
                        <SelectItem key={item.title} value={item.value}>
                          {item.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.reportType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.reportType.message}
              </p>
            )}
          </div>
          <div className="flex gap-2 justify-between">
            <div className="flex-1">
              <p className="font-medium text-gray-600">From Date</p>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className={`w-full ${
                      errors.startDate ? 'border-red-500' : ''
                    }`}
                    placeholder="Pick Start Date"
                    handleDateChange={(date: string) => field.onChange(date)}
                    type="start"
                  />
                )}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-600">To Date</p>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className={`w-full ${
                      errors.endDate ? 'border-red-500' : ''
                    }`}
                    placeholder="Pick End Date"
                    handleDateChange={(date: string) => field.onChange(date)}
                    type="end"
                  />
                )}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-600">Export Format</p>
            <Button variant="outline" className="w-64" disabled>
              <FileSpreadsheet className="mr-2 h-4 w-4 text-green-500" />
              Excel (.xlsx)
            </Button>
          </div>
          <Button type="submit" className="w-full">
            Generate & Download Report
          </Button>
        </form>
      </Card>
    </>
  );
};

export default GenerateReport;
