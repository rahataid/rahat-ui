import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { cn } from '@rahat-ui/shadcn/src';
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
import { Pencil } from 'lucide-react';
import Link from 'next/link';

type IProps = {
  path: string;
  className?: string;
};

export default function EditButton({ path, className }: IProps) {
  const t = useTranslations('GLOBAL');
  const tc = useTranslations('CONFIRMATION_ALERT_DIALOGS');
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger>
          <AlertDialog>
            <AlertDialogTrigger className="flex items-center">
              <div
                className={cn(
                  'rounded-full border border-primary text-primary bg-card p-2 shadow-md',
                  className,
                )}
              >
                <Pencil size={20} strokeWidth={1.5} />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('ARE_YOU_ABSOLUTELY_SURE')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {tc('THIS_ACTION_WILL_REDIRECT_YOU_TO')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('CANCEL')}</AlertDialogCancel>
                <Link href={path}>
                  <AlertDialogAction>{t('CONTINUE')}</AlertDialogAction>
                </Link>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TooltipTrigger>
        <TooltipContent className="bg-secondary">
          <p className="text-xs font-medium">{t('EDIT')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
