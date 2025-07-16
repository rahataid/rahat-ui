import {
  PROJECT_SETTINGS_KEYS,
  useBulkAllocateTokens,
  useFindAllDisbursementPlans,
  useFindAllDisbursements,
  useGetTokenAllocations,
  usePagination,
  useProjectBeneficiaries,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import ChartLine from '@rahat-ui/shadcn/src/components/charts/chart-components/chart-line';
import { Avatar } from '@rahat-ui/shadcn/src/components/ui/avatar';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { UUID } from 'crypto';
import { isEmpty } from 'lodash';
import {
  Banknote,
  MoreVertical,
  SendHorizontal,
  User,
  Users,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { DisbursementConditionType } from '../disbursement-management/2-disbursement-condition';
import { useEffect, useState } from 'react';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { formatEther } from 'viem';
import { useReadRahatTokenBalanceOf } from 'libs/query/src/lib/rp/contracts/generated-hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import StepProgress from '../../components/step.progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';

const sampleSeries = [
  {
    name: 'Series 1',
    data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
  },
];

const sampleCategories = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const dibsursementConditions = [
  {
    type: DisbursementConditionType.BALANCE_CHECK,
    description: 'When project receives enough token',
  },
  {
    type: DisbursementConditionType.APPROVER_SIGNATURE,
    description: 'When disbursement approved by admin',
  },
  {
    type: DisbursementConditionType.SCHEDULED_TIME,
    description: 'When scheduled time is reached',
  },
];

const FundManagementView = () => {
  const route = useRouter();
  const { id } = useParams() as { id: UUID };
  const { data: disbursementData } = useFindAllDisbursementPlans(id);
  const [rowData, setRowData] = useState<any[]>([]);

  const totalBeneficiaries = disbursementData?._count?.Disbursements;
  const filteredConditions = dibsursementConditions.filter((condition) =>
    disbursementData?.conditions?.includes(condition.type),
  );
  // This is a temporary solution for showing the name
  const { pagination, filters } = usePagination();

  const projectBeneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: 100,
    //pagination.perPage,
    order: 'desc',
    sort: 'updatedAt',
    projectUUID: id,
    ...filters,
  });

  const disbursements = useFindAllDisbursements(id, {
    hideAssignedBeneficiaries: false,
  });

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  const syncDisbursementAllocation = useBulkAllocateTokens(
    contractSettings?.rahattoken?.address,
  );

  const tokenBalance = useReadRahatTokenBalanceOf({
    address: contractSettings?.rahattoken?.address as `0x${string}`,
    args: [contractSettings?.rahatpayrollproject?.address as `0x${string}`],
    query: {
      select(data) {
        return data ? Number(data) : 'N/A';
      },
    },
  });

  // console.log('rpTokenDecimals', rpTokenDecimals.data);
  const chainTokenAllocations = useGetTokenAllocations(
    contractSettings?.rahatpayrollproject?.address as `0x${string}`,
    contractSettings?.rahattoken?.address as `0x${string}`,
  );

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
        setRowData(
          projectBeneficiaryDisbursements.filter(
            (disbursement) => disbursement.disbursementAmount !== '0',
          ),
        );
      }
    }
  }, [
    disbursements?.data,
    disbursements?.data?.data,
    disbursements?.isSuccess,
    projectBeneficiaries.data?.data,
    projectBeneficiaries.isSuccess,
  ]);

  const handleAllocationSync = async () => {
    await syncDisbursementAllocation.mutateAsync({
      beneficiaryAddresses: disbursementData.Disbursements,
      projectAddress: contractSettings?.rahatpayrollproject?.address,
      tokenAddress: contractSettings?.rahattoken?.address,
    });
  };

  const handleAddDisburse = () => {
    route.push(`/projects/rp/${id}/fundManagement/disburse`);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-2 p-4 bg-secondary h-[calc(100vh-75px)]">
        <div className="col-span-12 md:col-span-4">
          <DataCard
            className="rounded-sm"
            title="Project Balance"
            number={tokenBalance?.data || 'N/A'}
            Icon={Banknote}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <DataCard
            className="rounded-sm"
            title="Project Contract Address"
            number={
              truncateEthAddress(
                contractSettings?.rahatpayrollproject?.address,
              ) || 'N/A'
            }
            Icon={SendHorizontal}
          />
        </div>

        {/* Recent Sales */}
        <div className="col-span-12 md:col-span-4 md:row-span-3 rounded-sm">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Deposits</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[400px]">
              {rowData?.map((row) => (
                <CardContent
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
                      <p className="text-sm font-medium leading-none">
                        {row?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {truncateEthAddress(row?.walletAddress, 4)}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      ${row?.disbursementAmount}
                    </div>
                  </div>
                </CardContent>
              ))}
            </ScrollArea>
          </Card>
        </div>

        {/* Tokens Deposits Chart */}
        <div className="col-span-12 md:col-span-8 md:row-span-2 p-2 shadow rounded bg-card h-full">
          <ChartLine series={sampleSeries} categories={sampleCategories} />
        </div>

        {/* Disbursement Plan */}
        {!isEmpty(disbursementData) ? (
          <div className="col-span-12 p-4 shadow rounded flex flex-col  bg-card h-72">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Disbursement Plan</h2>
              {/* {+chainTokenAllocations.data !==
              +disbursementData?.totalAmount ? ( */}
              <div className="flex gap-6">
                <Button
                  variant={'secondary'}
                  onClick={handleAllocationSync}
                  disabled={
                    syncDisbursementAllocation.isPending ||
                    String(chainTokenAllocations.data) ===
                      String(disbursementData?.totalAmount)
                  }
                >
                  Sync chain
                </Button>
                {/* ) : null} */}
                {/* MODAL EXAMPLE START */}

                {/* <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Edit Profile</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                      <DialogTitle>Transactions</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 p-4">
                      <StepProgress />
                    </div>
                  </DialogContent>
                </Dialog> */}

                {/* MODAL EXAMPLE END */}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical
                      className="cursor-pointer"
                      size={20}
                      strokeWidth={1.5}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleAddDisburse}>
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DataCard
                className="rounded-lg"
                title="Total Beneficiaries"
                number={totalBeneficiaries}
                Icon={Users}
              />
              {/* <div className="flex items-center justify-center flex-col p-4 bg-gray-50 border rounded-lg w-full">
                <div className="text-blue-500 text-3xl font-bold">244</div>
                <div className="text-gray-700">Total Beneficiaries</div>
              </div> */}

              <DataCard
                className="rounded-lg"
                title="Tokens Required"
                number={disbursementData?.totalAmount}
                Icon={Users}
              />
              <div className="p-4 bg-gray-50 border rounded-lg w-full">
                <div className="text-gray-700 font-semibold mb-2">
                  Disbursement Conditions
                </div>
                <ul className="list-disc list-inside text-gray-600">
                  {filteredConditions.map((condition) => (
                    <li key={condition.type}>{condition.description}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-12 p-4 shadow rounded flex flex-col items-center justify-center bg-card h-72">
            <div className="text-center">
              <div className="text-xl">No data available</div>
              <p>
                There is no content at the moment. Create a disbursement plan to
                add data.
              </p>
              <Button
                onClick={handleAddDisburse}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Create Disbursement Plan
              </Button>
            </div>
          </div>
        )}
      </div>{' '}
    </>
  );
};

export default FundManagementView;
