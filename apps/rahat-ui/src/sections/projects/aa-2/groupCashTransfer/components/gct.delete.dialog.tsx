'use client';

import { useTranslations } from 'next-intl';
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
  const t = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tGlobal = useTranslations('GLOBAL');
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
          <DialogTitle>{t('DELETE_GCT_GROUP')}</DialogTitle>
          <DialogDescription>
            {t('ARE_YOU_SURE_YOU_WANT_TO_DELETE', { name: item?.name })}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={deleteGct.isPending}
          >
            {tGlobal('CANCEL')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteGct.isPending}
          >
            {deleteGct.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('DELETING')}
              </>
            ) : (
              tGlobal('DELETE')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
