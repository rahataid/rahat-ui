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
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

type IProps = {
  path?: string;
  className?: string;
  description?: string;
  onFallback?: (data?: any) => void;
};

export function EditButton({
  path,
  className,
  description = 'This action will redirect you to the edit page',
  onFallback,
}: IProps) {
  const router = useRouter();
  const handleClick = () => {
    if (path) {
      router.push(path);
    } else if (onFallback) {
      onFallback();
    }
  };
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger>
          <AlertDialog>
            <AlertDialogTrigger className="flex items-center">
              <div
                className={cn(
                  'rounded-full border border-primary text-primary bg-card p-2 hover:shadow-md',
                  className,
                )}
              >
                <Pencil size={20} strokeWidth={1.5} />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClick}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TooltipTrigger>
        <TooltipContent className="bg-secondary">
          <p className="text-xs font-medium">Edit</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
