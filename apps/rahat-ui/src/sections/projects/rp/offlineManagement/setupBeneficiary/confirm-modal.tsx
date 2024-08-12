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

export function ConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);
  const route = useRouter();
  const id = useParams();
  const handleRoute = () => {
    route.push(`/projects/rp/${id}/offlineManagement`);
  };
  const handleClose = (open: boolean) => {
    if (!open) {
      handleRoute();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-36"
        >
          Finish
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center">
            {' '}
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </DialogTitle>
          <DialogDescription>
            <h2 className="text-lg font-semibold text-green-700 mb-4 text-center">
              Transaction Successful
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-500">
                  Vendor Name:
                </span>
                <span className="text-sm font-medium text-gray-500">
                  Beneficiaries:
                </span>
                <span className="text-sm font-medium text-gray-500">
                  No of tokens:
                </span>
              </div>
              <div className="flex flex-col gap-2 text-left">
                <span className="text-gray-800">Aadarsha Lamichhane</span>
                <span className="text-gray-800">43</span>
                <span className="text-gray-800">2,300</span>
              </div>
            </div>
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
