import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@rahat-ui/shadcn/components/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useTranslations } from 'next-intl';

type IProps = {
  name: string;
};

export default function ConfirmDeleteDialog({ name }: IProps) {
  const t = useTranslations('CONFIRMATION_ALERT_DIALOGS');
  const tg = useTranslations('GLOBAL');

  return (
    <DialogContent className="sm:max-w-[400px]">
      <DialogHeader>
        <DialogTitle>{t('DELETE_NAME', { name })}</DialogTitle>
        <DialogDescription>
          {t('THIS_ACTION_CANNOT_BE_UNDONE_THIS', { name })}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button type="submit" variant="outline">
          {tg('CANCEL')}
        </Button>
        <Button type="submit">{t('CONFIRM_ACTION')}</Button>
      </DialogFooter>
    </DialogContent>
  );
}
