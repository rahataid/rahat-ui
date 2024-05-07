import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { Minus } from 'lucide-react';
import { IStakeholdersItem } from 'apps/rahat-ui/src/types/stakeholders';
import EditStakeholders from './edit.stakeholders';

type IProps = {
    stakeholdersDetail: IStakeholdersItem;
    closeSecondPanel: VoidFunction;
};

export default function StakeholdersEditPanel({
    stakeholdersDetail,
    closeSecondPanel,
}: IProps) {

    return (
        <>
            <div className="py-4 px-2 bg-secondary">
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
            </div>
            <EditStakeholders stakeholdersDetail={stakeholdersDetail} />
        </>
    );
}
