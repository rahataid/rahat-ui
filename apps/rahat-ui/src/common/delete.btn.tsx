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

type IProps = {
  name: string;
  handleContinueClick: VoidFunction;
  className?: string;
  label?: string;
  disabled?: boolean;
};

export function DeleteButton({
  name,
  handleContinueClick,
  className,
  label = '',
  disabled = false,
}: IProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip disableHoverableContent>
        <TooltipTrigger
          className={disabled ? 'pointer-events-none opacity-50' : ''}
        >
          <AlertDialog>
            <AlertDialogTrigger className="flex items-center">
              <div
                className={cn(
                  'rounded-full border border-red-500 text-red-500 bg-card p-2 hover:shadow-md',
                  className,
                )}
              >
                <Trash2 size={20} strokeWidth={1.5} /> {label}
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this {name}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleContinueClick}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TooltipTrigger>
        <TooltipContent className="bg-secondary ">
          <p className="text-xs font-medium">Delete</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
