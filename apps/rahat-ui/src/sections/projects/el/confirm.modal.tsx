import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';

type Iprops = {
  open: boolean;
  close: boolean;
  isLoading: boolean;
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
  handleSubmit: (e: any) => void;
  // handleGoBack: () => void;
  handleClose: () => void;
  handleCreateVoucherSubmit: () => void;
};

const SuccessModal = ({
  open,
  voucherInputs,
  // handleGoBack,
  handleCreateVoucherSubmit,
  handleClose,
  isLoading,
}: Iprops) => {
  // const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   handleSubmit({ ...voucherInputs, description, price });
  // };
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[500px]">
        {isLoading ? (
          <div className="flex justify-center items-center gap-4">
            Processing...
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm</DialogTitle>
            </DialogHeader>
            <div>
              You are about to create{' '}
              <span className="text-primary">
                {' '}
                {voucherInputs.tokens} tokens
              </span>{' '}
              worth amount{' '}
              <span className="text-primary">
                {voucherInputs.currency} {voucherInputs.amountInDollar}
              </span>
              .
              <br /> Are you sure you want to continue ?
            </div>
            <div className="flex justify-center items-center gap-4">
              <Button onClick={handleCreateVoucherSubmit}>Submit</Button>
              {/* <Button
            onClick={() => {
              handleGoBack();
            }}
            variant="secondary"
          >
            Back to Edit
          </Button> */}
              <Button
                onClick={() => {
                  handleClose();
                }}
                variant="secondary"
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
