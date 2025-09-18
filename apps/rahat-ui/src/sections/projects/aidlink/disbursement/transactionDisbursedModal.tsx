import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import Link from 'next/link';

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
}

interface StatusStep {
  title: string;
  time: string;
  completed: boolean;
}

export function TransactionDisbursedModal({
  open,
  onOpenChange,
  data,
}: IProps) {
  console.log('data:', data);
  const { id: projectUUID } = useParams() as { id: UUID };
  const router = useRouter();

  const statusSteps: StatusStep[] = [
    {
      title: 'Transaction Initiated',
      time: '3:35:00 PM',
      completed: true,
    },
    {
      title: 'Safe Wallet Approval',
      time: '5:50:00 PM',
      completed: true,
    },
    {
      title: 'Disbursement Execution',
      time: '04:15:00 PM',
      completed: true,
    },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Transaction has been disbursed successfully
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {/* Amount Section */}
          <div className="bg-blue-50 rounded-sm p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Total Amount</p>
            <p className="text-2xl font-bold text-blue-600 mb-1">
              {data?.amount} USDC
            </p>
            {/* <p className="text-xs text-gray-500 mb-3">0x3ad4...f54</p> */}
            {/* <p className="text-sm text-gray-600">1,275 beneficiaries</p> */}
          </div>

          {/* Transaction cycle */}
          <div className="p-4 rounded-sm border">
            <div className="mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                The disbursement of USDC has been successfully completed through
                Rahat, and the funds are now available in beneficiaries' Shelter
                wallets.
              </p>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-1">
                <div className="flex-1 h-2 bg-blue-500 rounded-l-full" />
                <div className="flex-1 h-2 bg-blue-500" />
                <div className="flex-1 h-2 bg-blue-500 rounded-r-full" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {statusSteps.map((step, index) => (
                <div key={index} className="text-center">
                  {/* Status Icon */}
                  <div className="flex justify-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>

                  {/* Step Content */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {step.title}
                    </h3>
                    <span className="text-sm text-gray-500">{step.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-1">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() =>
                router.push(
                  `/projects/aidlink/${projectUUID}/disbursement/${data?.uuid}`,
                )
              }
            >
              View Disbursement Details
            </Button>
            <Link
              href="https://app.safe.global/transactions/queue?safe=basesep:0x8241F385c739F7091632EEE5e72Dbb62f2717E76"
              target="_blank"
              className="flex-1"
            >
              <Button variant="outline" className="w-full bg-transparent">
                Open Safe Wallet
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
