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
                  'rounded-full border border-red-500 text-red-500 bg-card p-[clamp(3px,0.6vw,8px)] hover:shadow-md',
                  className,
                )}
              >
                <Trash2
                  className="size-[clamp(14px,1.4vw,18px)]"
                  strokeWidth={1.5}
                />{' '}
                {label}
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[clamp(260px,30vw,512px)] p-[clamp(10px,2vw,24px)] gap-[clamp(6px,1.2vw,16px)]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[clamp(14px,1.6vw,18px)]">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[clamp(11px,1vw,14px)]">
                  This action cannot be undone. This will permanently delete
                  this {name}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="h-[clamp(26px,3.2vw,40px)] px-[clamp(10px,1.4vw,16px)] text-[clamp(11px,1vw,14px)]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleContinueClick}
                  className="h-[clamp(26px,3.2vw,40px)] px-[clamp(10px,1.4vw,16px)] text-[clamp(11px,1vw,14px)]"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TooltipTrigger>
        <TooltipContent className="bg-secondary ">
          <p className="text-[clamp(10px,0.9vw,12px)] font-medium">Delete</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
