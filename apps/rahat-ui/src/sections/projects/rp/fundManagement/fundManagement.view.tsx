import { Avatar } from '@rahat-ui/shadcn/src/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { ArrowUp, Users } from 'lucide-react';

const FundManagementView = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-2 p-4 bg-secondary h-[calc(100vh-55px)]">
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

        {/* Recent Deposits */}
        <div className="col-span-12 md:col-span-4 md:row-span-2">
          <Card>
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
        <div className="md:col-span-8 p-4 shadow rounded bg-card">
          <div>Tokens Deposits</div>
          <div>[Chart Component]</div>
        </div>

        {/* Disbursement Plan */}
        <div className="col-span-12 p-4 shadow rounded flex flex-col items-center justify-center bg-card">
          <div className="text-center">
            {/* <Image
              src="/noData.png"
              height={500}
              width={500}
              alt="No data available"
              className="mb-4"
            /> */}
            <div className="text-xl">No data available</div>
            <p>
              There is no content at the moment. Create a disbursement plan to
              add data.
            </p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Create Disbursement Plan
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FundManagementView;
