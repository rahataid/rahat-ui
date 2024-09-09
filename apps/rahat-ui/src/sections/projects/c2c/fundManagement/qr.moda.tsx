import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { QrCode } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import QRCode from 'react-qr-code';

export function QrModal({ projectAddress }: { projectAddress: string }) {
  console.log('projectAddress', projectAddress);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <QrCode className="cursor-pointer" size={20} strokeWidth={1.5} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code to make a payment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center items-center gap-4">
            {isLoading ? (
              <Skeleton className="w-[320px] h-[320px]" />
            ) : (
              <QRCode value={projectAddress} size={256} />
              // <Image src="/qr.png" height={320} width={320} alt="qr" />
            )}
          </div>
        </div>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
