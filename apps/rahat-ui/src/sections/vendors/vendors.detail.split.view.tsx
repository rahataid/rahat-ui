import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { Archive, Minus, Trash2 } from 'lucide-react';

type IProps = {
    vendorsDetail: any,
    closeSecondPanel: VoidFunction
}

export default function VendorsDetailSplitView({ vendorsDetail, closeSecondPanel }: IProps) {
    return (
        <div className="p-2 bg-card mr-2 rounded border">
            <div className="flex gap-4">
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger onClick={closeSecondPanel}>
                            <Minus size={20} strokeWidth={1.5} />
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary ">
                            <p className="text-xs font-medium">Close</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger>
                            <Archive size={20} strokeWidth={1.5} />
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary ">
                            <p className="text-xs font-medium">Archive</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger>
                            <Trash2 size={20} strokeWidth={1.5} />
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary ">
                            <p className="text-xs font-medium">Delete</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className='mt-4 flex flex-col gap-2'>
                <p>Status : {vendorsDetail?.status ?? "Vendor's Status"}</p>
                <p>Email: {vendorsDetail?.email ?? "Vendor's Email"}</p>
                <p>Amount: {vendorsDetail?.amount ?? "Vendor's Amount"}</p>
            </div>
        </div>
    )
}