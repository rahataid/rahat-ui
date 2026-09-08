import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { useTranslations } from 'next-intl';

type IProps = {
  dialogTrigger: React.ReactNode;
  title: string;
  description: string;
  handleContinueClick: VoidFunction;
};

export function CustomAlertDialog({
  dialogTrigger,
  title,
  description,
  handleContinueClick,
}: IProps) {
  const tg = useTranslations('GLOBAL');
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="flex items-center">
        <div>{dialogTrigger}</div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="space-y-0">
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full">{tg('CANCEL')}</AlertDialogCancel>
          <AlertDialogAction className="w-full" onClick={handleContinueClick}>
            {tg('CONTINUE')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
