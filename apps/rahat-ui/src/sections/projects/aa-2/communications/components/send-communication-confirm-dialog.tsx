'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Loader2, SendHorizontal } from 'lucide-react';
import { CommunicationChannelIcon } from './communication-channel-icon';

export type SendCommunicationConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
  title?: string;
  channel?: string;
  recipientsCount?: number;
  groupsCount?: number;
  dialogTitle?: string;
  dialogDescription?: string;
};

export function SendCommunicationConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
  title,
  channel,
  recipientsCount,
  groupsCount,
  dialogTitle,
  dialogDescription,
}: SendCommunicationConfirmDialogProps) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatDigits = useLabelDigits();

  const handleConfirm = async () => {
    if (isPending) return;
    await onConfirm();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent
        className="w-[calc(100vw-2rem)] sm:max-w-md max-h-[85vh] flex flex-col p-5 sm:p-6 rounded-md overflow-hidden"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="text-left shrink-0 space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-primary border border-blue-100">
            <SendHorizontal className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base sm:text-lg font-semibold text-foreground">
            {dialogTitle || t('SEND_COMMUNICATION') || 'Send Communication'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground break-words">
            {dialogDescription ||
              t('SEND_COMMUNICATION_CONFIRM') ||
              'Are you sure you want to send this communication? This will start broadcasting to the selected audience.'}
          </DialogDescription>
        </DialogHeader>

        {(title || channel || recipientsCount != null || groupsCount != null) && (
          <div className="my-2 rounded-md border bg-muted/30 p-3 text-xs sm:text-sm space-y-2 min-w-0">
            {title && (
              <div className="min-w-0">
                <span className="text-xs text-muted-foreground font-medium block">
                  {t('COMMUNICATION_TITLE') || 'Communication Title'}
                </span>
                <p className="font-semibold text-foreground line-clamp-2 break-all [overflow-wrap:anywhere] mt-0.5">
                  {title}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-muted/60">
              {channel && (
                <Badge variant="secondary" className="gap-1 text-xs py-0.5 px-2">
                  <CommunicationChannelIcon channel={channel} className="h-3 w-3" />
                  {t(channel.toUpperCase())}
                </Badge>
              )}

              {recipientsCount != null && recipientsCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {formatDigits(recipientsCount)} {t('INDIVIDUALS') || 'individuals'}
                </span>
              )}

              {groupsCount != null && groupsCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  • {formatDigits(groupsCount)} {t('GROUPS') || 'groups'}
                </span>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t shrink-0 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {tg('CANCEL') || 'Cancel'}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="w-full sm:w-auto gap-1.5"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                {t('SENDING') || 'Sending...'}
              </>
            ) : (
              <>
                <SendHorizontal className="h-4 w-4" />
                {t('SEND_COMMUNICATION') || 'Send Communication'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
