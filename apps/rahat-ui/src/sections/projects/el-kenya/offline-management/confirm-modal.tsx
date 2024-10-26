import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { CheckCircleIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

type IConfirmModal = {
  isOpen: boolean;
  beneficiaries: number;
  vendorName: string;
  tokens: number;
};

export function ConfirmModal({
  isOpen,
  beneficiaries,
  vendorName,
  tokens,
}: IConfirmModal) {
  const route = useRouter();
  const { id } = useParams();
  const handleRoute = () => {
    route.push(`/projects/el-kenya/${id}/offline-management`);
  };
  const handleClose = (open: boolean) => {
    if (!open) {
      handleRoute();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center">
            {' '}
            <CheckCircleIcon className="h-8 w-8 text-blue-600" />
          </DialogTitle>
          <DialogDescription>
            <h2 className="text-lg font-semibold text-green-700 mb-4 text-center">
              Transaction Added to Queue
            </h2>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-500">
                Vendor Name:
                <span className="ml-1 text-gray-800 font-normal">
                  {vendorName}
                </span>
              </p>
              <p className="text-sm font-medium text-gray-500 ">
                Beneficiaries:
                <span className="ml-1 text-gray-800 font-normal">
                  {beneficiaries}
                </span>
              </p>
              <p className="text-sm font-medium text-gray-500">
                No of vouchers:
                <span className="ml-1 text-gray-800 font-normal">{tokens}</span>
              </p>
            </div>
            <p className="mt-2 text-gray-500">
              Data will be processed in the background. You can check the status
              in the offline management page.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleRoute} type="submit">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
