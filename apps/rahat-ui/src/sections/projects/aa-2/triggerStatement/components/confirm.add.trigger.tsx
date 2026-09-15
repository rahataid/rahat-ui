import React from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { IconLabelBtn } from 'apps/rahat-ui/src/common';
import { Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

type IProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleStore: () => void;
  handleAddAnother: () => void;
  handleSave: VoidFunction;
  onCancel: () => void;
  isSubmitting: boolean;
};

export default function ConfirmAddTrigger({
  open,
  setOpen,
  handleStore,
  handleAddAnother,
  handleSave,
  onCancel,
  isSubmitting = false,
}: IProps) {
  const t = useTranslations('AA_PROJECT');
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* <AlertDialogTrigger asChild> */}
      <Button disabled={isSubmitting} className="w-40" onClick={handleStore}>
        {isSubmitting ? t('PLEASE_WAIT') : t('CONFIRM')}
      </Button>
      {/* </AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="flex-1 text-center">
              {t('ONE_TRIGGER_ADDED')}
            </AlertDialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <AlertDialogDescription className="text-center">
            {t('CLICK_SAVE_TO_CONFIRM')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col space-y-2">
          <Button onClick={handleSave}>{t('SAVE')}</Button>
          <IconLabelBtn
            variant="outline"
            className="flex flex-row-reverse gap-2"
            Icon={Plus}
            name={t('ADD_ANOTHER_TRIGGER')}
            handleClick={() => handleAddAnother()}
          />
          {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
