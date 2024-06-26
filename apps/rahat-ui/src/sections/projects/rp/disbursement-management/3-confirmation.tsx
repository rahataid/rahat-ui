import React, { FC } from 'react';
import { initialStepData } from './fund-management-flow';
import { useFindAllDisbursements } from '@rahat-ui/query';
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
  const disbursements = useFindAllDisbursements(id);
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
              <p>Project Balance:</p>
              <p>400 USDC</p>
            </div>
            {stepData.bulkInputAmount ? (
              <div className="flex flex-col gap-2">
                <p>Send Amount among Beneficiaries:</p>
                <p>{stepData?.bulkInputAmount} USDC</p>
              </div>
            ) : null}
            <div className="flex flex-col gap-2">
              <p>Total Amount to Send:</p>
              <p>
                {disbursements.data?.reduce(
                  (acc: number, disbursement: any) => acc + disbursement.amount,
                  0,
                )}{' '}
                USDC
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-6 mb-8">
        <div className="bg-card border border-neutral-200 h-full p-3 rounded-sm">
          <p className="font-medium ml-3">Beneficiary List</p>
          <p className="font-light text-sm text-gray-500 ml-3">
            4 Beneficiaries Selected
          </p>
          <div className="flex flex-col gap-8 p-1">
            <ScrollArea className="h-96">
              <div className="grid gap-8 bg-neutral-100 m-2 p-4 rounded-sm">
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
                      Beneficiary name
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-green-500 font-medium">
                    +$1
                  </div>
                </div>
              </div>
              <div className="grid gap-8 bg-neutral-100 m-2 p-4 rounded-sm">
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
                      Beneficiary name
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-green-500 font-medium">
                    +$190
                  </div>
                </div>
              </div>
              <div className="grid gap-8 bg-neutral-100 m-2 p-4 rounded-sm">
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
                      Beneficiary name
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-green-500 font-medium">
                    +$1,999.00
                  </div>
                </div>
              </div>
              <div className="grid gap-8 bg-neutral-100 m-2 p-4 rounded-sm">
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
                      Beneficiary name
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-green-500 font-medium">
                    +$187
                  </div>
                </div>
              </div>
              <div className="grid gap-8 bg-neutral-100 m-2 p-4 rounded-sm">
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
                      Beneficiary name
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-green-500 font-medium">
                    +$1,999.00
                  </div>
                </div>
              </div>
              <div className="grid gap-8 bg-neutral-100 m-2 p-4 rounded-sm">
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
                      Beneficiary name
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-green-500 font-medium">
                    +$1,999.00
                  </div>
                </div>
              </div>
              <div className="grid gap-8 bg-neutral-100 m-2 p-4 rounded-sm">
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
                      Beneficiary name
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-green-500 font-medium">
                    +$1,999.00
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisbursementConfirmation;
