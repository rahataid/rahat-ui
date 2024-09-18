import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { BadgePlus } from 'lucide-react';
import { useState } from 'react';

type IProps = {
  handleSubmit: (numberOfTokens: number, groupUUid: string) => void;
  bulk: boolean;
  uuid?: string;
  selectedGroupId?: string[];
};

export default function GroupDisbursementAssignModel({
  uuid,
  handleSubmit,
  bulk,
  selectedGroupId,
}: IProps) {
  const [token, setToken] = useState('');
  const handleInputChange = (e: any) => {
    setToken(e.target.value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full flex justify-between items-center">
          <div className="flex w-full gap-3 items-center cursor-pointer">
            {!bulk ? (
              <Button className="dark:bg-secondary dark:text-white bg-sky-100 text-blue-600 flex w-full mt-2 items-center gap-2 hover:bg-sky-200">
                <BadgePlus size={18} strokeWidth={1.5} />
                Assign
              </Button>
            ) : (
              <Button className="flex items-center gap-2">
                <BadgePlus size={18} strokeWidth={1.5} />
                Bulk Assign
              </Button>
            )}
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="bg-white p-6 shadow-md rounded-md max-w-md w-full">
        <DialogHeader className="text-center">
          {bulk ? (
            <>
              <DialogTitle className="text-lg font-semibold text-gray-800">
                Bulk Disbursement Amount
              </DialogTitle>
              <p className="text-gray-500 text-sm">
                Enter the amount you want to assign to all the selected groups
              </p>
            </>
          ) : (
            <>
              <DialogTitle className="text-lg font-semibold text-gray-800">
                Disbursement Amount
              </DialogTitle>
              <p className="text-gray-500 text-sm">
                Enter the amount you want to assign to the selected group
              </p>
            </>
          )}
        </DialogHeader>

        <div className="my-4">
          <Label
            htmlFor="token"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Disbursement Amount
          </Label>
          <Input
            className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            value={token}
            placeholder="Enter amount to assign"
            onChange={handleInputChange}
            id="token"
          />
        </div>

        <DialogFooter className="flex justify-between space-x-4 mt-6">
          <DialogClose asChild>
            <Button className="w-1/2 bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="w-1/2 bg-blue-600 text-white hover:bg-blue-700"
            disabled={false}
            onClick={() => {
              if (bulk) {
                selectedGroupId?.map(async (uuid) => {
                  await handleSubmit(Number(token), uuid);
                });
              } else {
                handleSubmit(Number(token), uuid);
              }
            }}
          >
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
