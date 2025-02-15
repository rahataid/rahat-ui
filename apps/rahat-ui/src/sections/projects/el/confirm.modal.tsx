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
  isTransacting: boolean;
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
  isTransacting,
  // handleGoBack,
  handleCreateVoucherSubmit,
  handleClose,
  isLoading,
}: Iprops) => {
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
                {voucherInputs.tokens} vouchers
              </span >{' '}
              {' '} and {' '}
              <span className="text-primary">
                {+voucherInputs.tokens * 3} discount vouchers
              </span>
              {/* <span className="text-primary">
                {voucherInputs.currency} {voucherInputs.amountInDollar}
              </span> */}
              .
              <br /> Are you sure you want to continue ?
            </div>
            <div className="flex justify-center items-center gap-4">
              <Button
                onClick={handleCreateVoucherSubmit}
                disabled={isTransacting}
              >
                {isTransacting ? 'Confirming transaction...' : 'Submit'}
              </Button>
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
