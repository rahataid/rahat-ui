import {
  Dialog,
  DialogContent,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Template } from 'apps/rahat-ui/src/types/activities';
import React from 'react';
type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
};
const TemplateDetailsDialog = ({
  open,
  onOpenChange,
  template,
}: DialogProps) => {
  console.log('Template details received in dialog:', template);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-h-[80vh]">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Template Details</h2>
          <p>Here you can view the details of the selected template.</p>
          {/* Add more details as needed */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDetailsDialog;
