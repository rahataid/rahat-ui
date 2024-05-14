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
import { FC, useState } from 'react';
import { useProjectVoucher } from '../../../hooks/el/subgraph/querycall';
import { useParams, useRouter } from 'next/navigation';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import {
  useReadElProjectGetProjectVoucherDetail,
  useReadElProjectGetTotalBeneficiaries,
} from 'apps/rahat-ui/src/hooks/el/contracts/elProject';

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
  handleSubmit: () => void;
  handleModal: () => void;
  isTransacting: boolean;
}
 
const CreateVoucherModal: FC<CreateVoucherModalType> = ({
  voucherInputs,
  handleInputChange,
  handleModal,
  handleSubmit,
  isTransacting
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

  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmitCheck = (e: any) => {
    e.preventDefault();
    if (!voucherInputs.tokens) {
      setErrorMessage('Please enter the number of free vouchers.');
    } else {
      handleSubmit();
    }
  };

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const { data: projectVoucher, isLoading } = useProjectVoucher(
    contractSettings?.elproject?.address || '',
    contractSettings?.eyevoucher?.address || '',
  );

  const handleVoucherCreate = () => {
    route.push(`/projects/el/${id}/vouchers`);
  };

  const { data: benfData } = useReadElProjectGetProjectVoucherDetail({
    address: contractSettings?.elproject?.address,
  });

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
        {!isLoading && benfData?.eyeVoucherBudget ? (
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
                    <span className="text-xl font-medium text-primary">
                      {Number(benfData?.eyeVoucherBudget)}
                    </span>
                  </p>
                  <p className="text-sm flex items-center gap-1 text-muted-foreground font-normal">
                    Discount Vouchers:{' '}
                    <span className="text-xl font-medium text-primary">
                      {Number(benfData?.referredVoucherBudget)}
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
                      type="number"
                      min="1"
                      onFocus={() => setErrorMessage('')}
                    />
                  </div>
                  {errorMessage && (
                    <p className="text-sm text-red-500">{errorMessage}</p>
                  )}
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
                      Discount voucher will be minted.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleSubmitCheck} disabled={isTransacting}>{isTransacting ? "Confirming Transaction..." : "Submit"}</Button>
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
