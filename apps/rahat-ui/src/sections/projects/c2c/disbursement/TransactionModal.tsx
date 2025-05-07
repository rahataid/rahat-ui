import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Loader2, CheckCircle, Circle, X, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const TransactionModal = ({
  isModalOpen,
  setIsModalOpen,
  transactionStep,
  errorMessage,
  txHash,
}) => {
  const stepOrder = ['initiating', 'waiting', 'updating', 'success'];

  const getStepIcon = (step) => {
    const currentIndex = stepOrder.indexOf(transactionStep);
    const stepIndex = stepOrder.indexOf(step);

    if (transactionStep === 'error') {
      return currentIndex >= stepIndex ? (
        <CheckCircle className="text-green-600 h-5 w-5" />
      ) : (
        <Circle className="text-gray-400 h-5 w-5" />
      );
    }
    if (currentIndex === stepIndex) {
      return <Loader2 className="animate-spin text-blue-500 h-5 w-5" />;
    }
    if (currentIndex > stepIndex || transactionStep === 'success') {
      return <CheckCircle className="text-green-600 h-5 w-5" />;
    }
    return <Circle className="text-gray-400 h-5 w-5" />;
  };

  const handleClose = () => {
    if (['initiating', 'waiting', 'updating'].includes(transactionStep)) {
      Swal.fire({
        title: 'Transaction in Progress',
        text: 'Closing the modal will not stop the transaction. You can check the status later.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Close Anyway',
        cancelButtonText: 'Keep Open',
      }).then((result) => {
        if (result.isConfirmed) {
          setIsModalOpen(false);
        }
      });
    } else {
      setIsModalOpen(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-md p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Executing Transaction
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-600 hover:text-gray-800" />
          </Button>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <ul className="space-y-3">
            <li className="flex items-center space-x-3">
              {getStepIcon('initiating')}
              <span className="text-gray-700">Initiating transaction</span>
            </li>
            <li className="flex items-center space-x-3">
              {getStepIcon('waiting')}
              <span className="text-gray-700">Waiting for confirmation</span>
            </li>
            <li className="flex items-center space-x-3">
              {getStepIcon('updating')}
              <span className="text-gray-700">Updating status</span>
            </li>
          </ul>
          {transactionStep === 'success' && (
            <p className="text-green-600 flex items-center text-sm font-medium bg-green-50 p-2 rounded">
              <CheckCircle className="mr-2 h-5 w-5" /> Transaction executed
              successfully!
            </p>
          )}
          {transactionStep === 'error' && (
            <p className="text-red-600 flex items-center text-sm font-medium bg-red-50 p-2 rounded">
              <AlertCircle className="mr-2 h-5 w-5" /> Error: {errorMessage}
            </p>
          )}
          {txHash && (
            <Button variant="link" asChild className="p-0 h-auto">
              <a
                href={`https://etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Transaction on Etherscan
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
