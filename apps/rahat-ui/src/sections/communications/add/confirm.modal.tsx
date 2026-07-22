import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { useTranslations } from 'next-intl';

type Iprops = {
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  isSubmitting?: boolean;
  selectedRows?: any;
};

const CampaignModal = ({
  handleSubmit,
  isSubmitting,
  selectedRows,
}: Iprops) => {
  const t = useTranslations('Communications – Add Campaign');
  const tg = useTranslations('GLOBAL');
  const submitBtnStatus = selectedRows?.length > 0 ? false : true;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'default'} disabled={submitBtnStatus}>
          {tg('SUBMIT')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('CONFIRM_CAMPAIGN')}</DialogTitle>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              {tg('CLOSE')}
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            type="button"
            variant="ghost"
            className="text-primary"
            disabled={isSubmitting}
          >
            {tg('CONFIRM')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignModal;
