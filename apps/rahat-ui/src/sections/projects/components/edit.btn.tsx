import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
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
import Link from 'next/link';

type IProps = {
    path: string;
}

export default function EditButton({ path }: IProps) {
    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger>
                    <AlertDialog>
                        <AlertDialogTrigger className="flex items-center">
                            <div className="rounded-full border border-primary text-primary bg-card p-2">
                                <Pencil size={20} strokeWidth={1.5} />
                            </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action will redirect you to the edit page
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Link href={path}>
                                    <AlertDialogAction>
                                        Continue
                                    </AlertDialogAction>
                                </Link>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </TooltipTrigger>
                <TooltipContent className="bg-secondary">
                    <p className="text-xs font-medium">Edit</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}