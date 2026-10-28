import { useTranslations } from 'next-intl';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';

type Iprops = {
  open: boolean;
  handleSubmit: (e: any) => void;
  handleClose: () => void;
  data: any;
};

const DeleteConfirmModal = ({
  open,
  handleClose,
  handleSubmit,
  data,
}: Iprops) => {
  const tr = useTranslations('USERS_ROLES_PERMISSIONS');
  const tg = useTranslations('GLOBAL');
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{tr('CONFIRM')}</DialogTitle>
        </DialogHeader>
        <div>{tr('DO_YOU_WANT_TO_DELETE_THE')}</div>
        <div className="flex justify-center items-center gap-4">
          <Button
            onClick={() => {
              handleSubmit(data);
              handleClose();
            }}
            variant="secondary"
          >
            {tg('CONFIRM')}
          </Button>
          <Button
            onClick={() => {
              handleClose();
            }}
            variant="outline"
          >
            {tg('CLOSE')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmModal;
