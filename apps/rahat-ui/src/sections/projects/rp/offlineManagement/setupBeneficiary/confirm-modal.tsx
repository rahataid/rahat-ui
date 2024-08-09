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

export function ConfirmModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white px-4 py-2 rounded-md w-36">
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
                <span>Vendor Name:</span>
                <span>Beneficiaries:</span>
                <span>No of tokens:</span>
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
            <Button type="submit">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
