import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';

interface IInfoModalProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  removeModal: RemoveModalType;
}

type RemoveModalType = {
  value: boolean;
  onToggle: () => void;
  onFalse: () => void;
};

const InfoModal = ({
  removeModal,
  title,
  description,
  children,
}: IInfoModalProps) => {
  return (
    <Dialog open={removeModal.value} onOpenChange={removeModal.onToggle}>
      <DialogContent className="max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{description}</p>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;
