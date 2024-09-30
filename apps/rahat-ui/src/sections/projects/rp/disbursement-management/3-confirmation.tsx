import React, { FC, useEffect } from 'react';
import { initialStepData } from './fund-management-flow';
import {
  PROJECT_SETTINGS_KEYS,
  useFindAllDisbursementPlans,
  useFindAllDisbursements,
  usePagination,
  useProjectBeneficiaries,
  useProjectSettingsStore,
  useReadRahatTokenBalanceOf,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { Avatar } from '@rahat-ui/shadcn/src/components/ui/avatar';
import { User } from 'lucide-react';

interface DisbursementConfirmationProps {
  handleStepDataChange: (e: any) => void;
  stepData: typeof initialStepData;
}

const DisbursementConfirmation: FC<DisbursementConfirmationProps> = ({
  handleStepDataChange,
  stepData,
}) => {
  const { id } = useParams() as { id: UUID };
  const [rowData, setRowData] = React.useState<any[]>([]);

  // This is a temporary solution for showing the name
  const { pagination, filters } = usePagination();

  const { data: disbursementData } = useFindAllDisbursementPlans(id);

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  const projectBeneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage:100,
    //  pagination.perPage,
    order: 'desc',
    sort: 'updatedAt',
    projectUUID: id,
    ...filters,
  });
  const disbursements = useFindAllDisbursements(id,{
    hideAssignedBeneficiaries: false,
  },);

  const {data:tokenBalance} = useReadRahatTokenBalanceOf({
    address: contractSettings?.rahattoken?.address as `0x${string}`,
    args: [contractSettings?.rahatpayrollproject?.address as `0x${string}`],
    query: {
      select(data) {
        return data ? Number(data) : 'N/A';
      },
    },
  });

  useEffect(() => {
    if (
      projectBeneficiaries.isSuccess &&
      projectBeneficiaries.data?.data &&
      disbursements?.isSuccess
    ) {
      const projectBeneficiaryDisbursements =
        projectBeneficiaries.data?.data.map((beneficiary) => {
          const beneficiaryDisbursement = disbursements?.data?.find(
            (disbursement: any) =>
              disbursement.walletAddress === beneficiary.walletAddress,
          );
          return {
            ...beneficiary,
            disbursementAmount: beneficiaryDisbursement?.amount || '0',
          };
        });

      if (
        JSON.stringify(projectBeneficiaryDisbursements) !==
        JSON.stringify(rowData)
      ) {
        setRowData(projectBeneficiaryDisbursements);
      }
    }
  }, [
    disbursements?.data,
    disbursements?.data?.data,
    disbursements?.isSuccess,
    projectBeneficiaries.data?.data,
    projectBeneficiaries.isSuccess,
    rowData,
  ]);
  return (
    <div className="grid grid-cols-12 gap-4 bg-card rounded-sm p-2">
      <div className="col-span-12 p-2">
        <h1 className="text-gray-700 text-xl font-medium">CONFIRMATION</h1>
      </div>
      <div className="col-span-6 mb-8">
        <div className="bg-stone-50 h-full p-3 rounded-sm">
          <div className="flex flex-col gap-8 p-3">
            <div className="flex flex-col gap-2">
              <p>Beneficiaries Selected:</p>
              <p>{disbursements.data?.length}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p>Project Token:</p>
              <p>{tokenBalance?.toString()}</p>
            </div>
            {stepData.bulkInputAmount ? (
              <div className="flex flex-col gap-2">
                <p>Send Amount among Beneficiaries:</p>
                <p>{stepData?.bulkInputAmount} USDC</p>
              </div>
            ) : null}
            <div className="flex flex-col gap-2">
              <p>Total Token to Send:</p>
              <p>
                {disbursements.data?.reduce(
                  (acc: number, disbursement: any) => acc + disbursement.amount,
                  0,
                )}{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-6 mb-8">
        <div className="bg-card border border-neutral-200 h-full p-3 rounded-sm">
          <p className="font-medium ml-3">Beneficiary List</p>

          <div className="flex flex-col gap-8 p-1">
            <ScrollArea className="h-96">
              {rowData?.map((row: any) => (
                <div
                  key={row?.walletAddress}
                  className="grid gap-8 bg-neutral-100 m-2 p-4 rounded-sm"
                >
                  <div className="flex items-center gap-4">
                    <Avatar
                      className={`h-9 w-9 sm:flex bg-gray-200 flex items-center justify-center`}
                    >
                      <User
                        className="text-primary"
                        size={20}
                        strokeWidth={1.75}
                      />
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm text-muted-foreground">
                        {row?.name}
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-green-500 ">
                      ${row?.disbursementAmount}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisbursementConfirmation;
