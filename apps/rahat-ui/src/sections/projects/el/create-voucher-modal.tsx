'use client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@rahat-ui/shadcn/components/alert';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Info, PlusSquare, TicketCheck } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { useProjectVoucher } from '../../../hooks/el/subgraph/querycall';
import { useParams, useRouter } from 'next/navigation';

interface CreateVoucherModalType {
  voucherInputs: {
    tokens: string;
    amountInDollar: string;
    amountInDollarReferral: string;
    freeVoucherDescription: string;
    descriptionReferred: string;
    currency: string;
    freeVoucherCurrency: string;
    referredVoucherCurrency: string;
    referredVoucherPrice: string;
    referredVoucherDescription: string;
  };
  open: boolean;
  handleInputChange: (e: any) => void;
  setVoucherInputs?: any;
  handleSubmit: (e: any) => void;
  handleModal: () => void;
}

const CreateVoucherModal: FC<CreateVoucherModalType> = ({
  voucherInputs,
  handleInputChange,
  handleModal,
  handleSubmit,
}) => {
  const handleSelectChange = (value: string) => {
    handleInputChange({
      target: {
        name: 'currency',
        value,
      },
    });
  };

  const { id } = useParams();
  const route = useRouter();

  const [contractAddress, setContractAddress] = useState<any>();

  const projectSettings = localStorage.getItem('projectSettingsStore');

  useEffect(() => {
    if (projectSettings) {
      const settings = JSON.parse(projectSettings)?.state?.settings?.[id];
      setContractAddress({
        el: settings?.elproject?.address,
        eyeVoucher: settings?.eyevoucher?.address,
        referredVoucher: settings?.referralvoucher?.address,
        rahatDonor: settings?.rahatdonor?.address,
      });
    }
  }, [projectSettings,id]);

  const { data: projectVoucher, isLoading } = useProjectVoucher(
    contractAddress?.el || '',
    contractAddress?.eyeVoucher || '',
  );

  const handleVoucherCreate = () => {
    route.push(`/projects/el/${id}/vouchers`);
  };

  return ( 
    <>
      <Dialog onOpenChange={handleModal}>
        <DialogTrigger asChild>
          <div className="w-full flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <PlusSquare size={18} strokeWidth={1.5} />
              <p>Create Voucher</p>
            </div>
          </div>
        </DialogTrigger>
        {!isLoading && projectVoucher?.freeVoucherAddress ? (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Mint Voucher</DialogTitle>
            </DialogHeader>
            <Alert className="rounded">
              <Info className="h-4 w-4" />
              <AlertTitle>Existing vouchers</AlertTitle>
              <AlertDescription className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm flex items-center gap-1 text-muted-foreground font-normal">
                    Free Vouchers:{' '}
                    <span className="text-xl font-medium text-primary">30</span>
                  </p>
                  <p className="text-sm flex items-center gap-1 text-muted-foreground font-normal">
                    Referred Vouchers:{' '}
                    <span className="text-xl font-medium text-primary">
                      1000
                    </span>
                  </p>
                </div>
                <form>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="noOfVouchers">No. of Free Vouchers</Label>
                    <Input
                      name="tokens"
                      className="w-2/3"
                      value={voucherInputs.tokens}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </AlertDescription>
            </Alert>
            <div>
              {voucherInputs.tokens && (
                <div className="w-full  mb-2">
                  <Alert className="rounded">
                    <TicketCheck className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                      For{' '}
                      <span className="text-primary">
                        {voucherInputs.tokens}{' '}
                      </span>{' '}
                      Free vouchers{' '}
                      <span className="text-primary">
                        {+voucherInputs.tokens * 3}{' '}
                      </span>
                      Referred voucher will be minted.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleSubmit}>Submit</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        ) : (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Mint Voucher</DialogTitle>
            </DialogHeader>
            <Alert className="rounded">
              <Info className="h-4 w-4" />
              <AlertTitle>Voucher Doesnot Exist</AlertTitle>
              <AlertDescription className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm flex items-center gap-1 text-muted-foreground font-normal">
                    No voucher has been created yet click the button to create
                    voucher.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleVoucherCreate}>Click Here</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default CreateVoucherModal;
