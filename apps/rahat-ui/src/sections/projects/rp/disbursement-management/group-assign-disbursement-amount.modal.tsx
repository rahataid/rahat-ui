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
              <Button className="dark:bg-secondary dark:text-white bg-sky-100 text-blue-600 felx w-full mt-2 items-center gap-2 hover:bg-sky-200">
                <BadgePlus size={18} strokeWidth={1.5} />
                Assign
              </Button>
            ) : (
              <Button className="felx items-center gap-2">
                <BadgePlus size={18} strokeWidth={1.5} />
                Bulk Assign
              </Button>
            )}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          {bulk ? (
            <div className="flex flex-col items-center">
              <DialogTitle>Bulk Disbursement Amount</DialogTitle>
              <div className="flex items-center justify-between text-muted-foreground text-base">
                Enter the amount you want to assign to all the selected groups
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <DialogTitle>Disbursement Amount</DialogTitle>
              <div className="flex items-center justify-between text-muted-foreground text-base">
                Enter the amount you want to assign to the selected group
              </div>
            </div>
          )}
        </DialogHeader>
        <div className="flex flex-col items-start gap-2">
          <div>
            <Label htmlFor="token" className="mb-2">
              Disbursement Amount
            </Label>
          </div>
          <div>
            <Input
              className="w-full"
              value={token}
              placeholder="Enter amount to assign"
              onChange={handleInputChange}
              id="token"
            />
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full justify-between">
            <DialogClose asChild>
              <Button className="dark:bg-secondary w-1/2 dark:text-white bg-sky-100 text-blue-600 felx items-center gap-2 hover:bg-sky-200">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="w-1/2"
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
