'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Check, Clock, ExternalLink } from 'lucide-react';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';

interface TransactionStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
}

export function TransactionInitiatedModal({
  open,
  onOpenChange,
  data,
}: TransactionStatusModalProps) {
  console.log('data:', data);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Transaction Initiated
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Section */}
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Total Amount</p>
            <p className="text-2xl font-bold text-blue-600 mb-1">
              {data?.amount} USDC
            </p>
            {/* <p className="text-xs text-gray-500 mb-3">0x3ad4...f54</p> */}
            {/* <p className="text-sm text-gray-600">1,275 beneficiaries</p> */}
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              We have successfully initiated the transaction from Rahat.
              Disbursement will be executed once they are approved by Safe
              Wallet Owners
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="relative">
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200">
                <div className="h-full w-1/3 bg-blue-500"></div>
              </div>
            </div>

            {/* Steps */}
            <div className="flex justify-between relative">
              {/* Step 1 - Completed */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-2 relative z-10">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  Transaction Initiated
                </p>
                <p className="text-xs text-gray-500">
                  {dateFormat(data?.updatedAt)}
                </p>
              </div>

              {/* Step 2 - Pending */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center mb-2 relative z-10">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  Safe Wallet Approval
                </p>
                <p className="text-xs text-yellow-600">Pending</p>
              </div>

              {/* Step 3 - Pending */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center mb-2 relative z-10">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  Disbursement Execution
                </p>
                <p className="text-xs text-yellow-600">Pending</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button disabled className="flex-1 bg-blue-600 hover:bg-blue-700">
              View Disbursement Details
            </Button>
            <Button
              disabled
              variant="outline"
              className="flex-1 bg-transparent"
            >
              Open Safe Wallet
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
