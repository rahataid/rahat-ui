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
  removeModal: RemoveModalType;
  link: string;
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

  link,
}: IInfoModalProps) => {
  return (
    <Dialog open={removeModal.value} onOpenChange={removeModal.onToggle}>
      <DialogContent className="max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{description}</p>
          <a
            target="_blank"
            href={link}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium inline-block"
          >
            Learn More
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;
