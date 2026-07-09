'use client';

import { Loader2 } from 'lucide-react';
import { UUID } from 'crypto';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useDeleteGroupCashTransfer } from '@rahat-ui/query';

// ─── Props ────────────────────────────────────────────────────────────────────

interface GctDeleteDialogProps {
  projectUUID: UUID;
  item: { uuid: string; name: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GctDeleteDialog({
  projectUUID,
  item,
  open,
  onOpenChange,
  onDeleted,
}: GctDeleteDialogProps) {
  const deleteGct = useDeleteGroupCashTransfer(projectUUID);

  const handleConfirm = async () => {
    if (!item) return;
    await deleteGct.mutateAsync({ uuid: item.uuid });
    onOpenChange(false);
    onDeleted?.();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !deleteGct.isPending && onOpenChange(o)}>
      <DialogContent className="w-[460px] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>Delete GCT Group</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-semibold text-foreground">"{item?.name}"</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={deleteGct.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteGct.isPending}
          >
            {deleteGct.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
