import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { useTranslations } from 'next-intl';

type Iprops = {
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
};

const ProjectConfirm = ({ open, handleSubmit, handleClose }: Iprops) => {
  const t = useTranslations('GLOBAL');
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('CONFIRM_PROJECT')}</DialogTitle>
        </DialogHeader>
        <DialogContent>{t('ARE_YOU_SURE')}</DialogContent>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button onClick={handleClose} type="button" variant="ghost">
              {t('CLOSE')}
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            type="button"
            variant="ghost"
            className="text-primary"
          >
            {t('CONFIRM')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectConfirm;
