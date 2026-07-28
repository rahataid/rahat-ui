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
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

type IProps = {
  name: string;
  handleContinueClick: VoidFunction;
  className?: string;
  disabled?: boolean;
};

export default function DeleteButton({
  name,
  handleContinueClick,
  className,
  disabled,
}: IProps) {
  const t = useTranslations('GLOBAL');
  const trigger = (
    <div
      className={cn(
        'rounded-full border border-red-500 text-red-500 bg-card p-2 shadow-md',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <Trash2 size={20} strokeWidth={1.5} />
    </div>
  );

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          {disabled ? (
            trigger
          ) : (
            <AlertDialog>
              <AlertDialogTrigger className="flex items items-center">
                {trigger}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('ARE_YOU_ABSOLUTELY_SURE')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('DELETE_CONFIRMATION', { name })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('CANCEL')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleContinueClick}>
                    {t('CONTINUE')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </TooltipTrigger>
        <TooltipContent className="bg-secondary">
          <p className="text-xs font-medium">{disabled ? t('CANNOT_DELETE_YOURSELF') : t('DELETE')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
