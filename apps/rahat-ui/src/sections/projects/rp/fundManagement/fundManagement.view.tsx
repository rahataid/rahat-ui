import { useFindAllDisbursementPlans } from '@rahat-ui/query';
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
import { ArrowUp, Users } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { DisbursementConditionType } from '../disbursement-management/2-disbursement-condition';
import { isEmpty } from 'lodash';

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
  const totalBeneficiaries = disbursementData?._count?.Disbursements;
  console.log('data', disbursementData);
  const filteredConditions = dibsursementConditions.filter((condition) =>
    disbursementData?.conditions?.includes(condition.type),
  );
  return (
    <>
      <div className="grid grid-cols-12 gap-2 p-4 bg-secondary h-[calc(100vh-75px)]">
        <div className="col-span-12 md:col-span-4">
          <DataCard
            className="rounded-sm"
            title="Beneficiaries"
            number={'0'}
            Icon={Users}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <DataCard
            className="rounded-sm"
            title="Beneficiaries"
            number={'0'}
            Icon={Users}
          />
        </div>

        {/* Recent Sales */}
        <div className="col-span-12 md:col-span-4 md:row-span-3 rounded-sm">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <ScrollArea className="min-h-96">
              <CardContent className="grid gap-8">
                <div className="flex items-center gap-4">
                  <Avatar
                    className={`h-9 w-9 sm:flex bg-green-200 flex items-center justify-center`}
                  >
                    <ArrowUp size={20} strokeWidth={1.25} />
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      Olivia Martin
                    </p>
                    <p className="text-sm text-muted-foreground">
                      olivia.martin@email.com
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$1,999.00</div>
                </div>
              </CardContent>
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
            <h2 className="text-lg font-semibold mb-4">Disbursement Plan</h2>
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
                  Disbursement Status
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
                onClick={() =>
                  route.push(`/projects/rp/${id}/fundManagement/disburse`)
                }
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
