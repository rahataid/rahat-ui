import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { ArrowLeft, ArchiveRestore, Pencil } from 'lucide-react';
import ActivityDetailCard from './activity.detail.card';
import ActivityDetailCards from './activity.detail.cards';
import ActivityCommunicationListCard from './activity.communication.list.card';
import ActivityPayoutCard from './activity.payout.card';
import { useSingleActivity } from '@rahat-ui/query';
import { UUID } from 'crypto';

export default function ActivitiesDetailView() {
    const router = useRouter();
    const { id: projectID, activityID } = useParams();
    const { data: activityDetail } = useSingleActivity(projectID as UUID, activityID);

    return (
        <div className="h-[calc(100vh-65px)] bg-secondary p-4">
            <div className="flex justify-between">
                <div className="flex gap-4 items-center">
                    <ArrowLeft
                        size={25}
                        strokeWidth={1.5}
                        className="cursor-pointer"
                        onClick={() => router.back()}
                    />
                    <h1 className="text-xl font-semibold">Demo Activity Title</h1>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="rounded-full border border-primary text-primary bg-card p-2">
                        <Pencil size={20} strokeWidth={1.5} />
                    </div>
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger>
                                <AlertDialog>
                                    <AlertDialogTrigger className="flex items-center">
                                        <div className="rounded-full border border-red-500 text-red-500 bg-card p-2">
                                            <ArchiveRestore size={20} strokeWidth={1.5} />
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently
                                                delete this activity.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                            >
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
                </div>
            </div>
            <ActivityDetailCards activityDetail={activityDetail} />
            <div className="grid grid-cols-3 gap-4 mt-4">
                <ActivityDetailCard activityDetail={activityDetail} />
                <ActivityCommunicationListCard activityDetail={activityDetail} projectId={projectID} />
                <ActivityPayoutCard />
            </div>
        </div>
    );
}