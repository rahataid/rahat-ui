import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Eye } from 'lucide-react';
import Image from 'next/image';

export function BeneficiaryList({ beneficiaryData }: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Eye
          className="text-primary-forground cursor-pointer"
          size={20}
          strokeWidth={1.5}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="mb-6">
          <DialogTitle>Beneficiary List</DialogTitle>
          <DialogDescription>
            {beneficiaryData?.length} beneficiaries assigned under this group
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72">
          {beneficiaryData?.map((d: any) => {
            return (
              <>
                <div
                  className="flex items-center justify-normal gap-6 p-2 max-w-md bg-card
            rounded-lg shadow mb-2"
                >
                  <Image
                    className="rounded-full"
                    src={'/profile.png'}
                    height={20}
                    width={20}
                    alt="profile pic"
                  />
                  <p className="text-magenta">{d?.Beneficiary?.pii?.name}</p>
                </div>
              </>
            );
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
