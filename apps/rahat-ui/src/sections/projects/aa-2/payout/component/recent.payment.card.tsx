import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { Eye, ArrowLeftRight, Dot } from 'lucide-react';
import {
  TooltipContent,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from 'libs/shadcn/src/components/ui/tooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { isCompleteBgStatus } from 'apps/rahat-ui/src/utils/get-status-bg';
interface GroupCardProps {
  beneficiaryGroupName: string;
  actions: string;
  merchentName: string;
  beneficiariesCount: number;
  dateTime: string;
  onView?: () => void;
  vendorName?: string;
  status?: string;
}

export default function RecentPaymentCard({
  beneficiaryGroupName,
  actions,
  merchentName,
  beneficiariesCount,
  dateTime,
  onView,
  vendorName,
  status,
}: GroupCardProps) {
  return (
    <div
      className={`flex items-center justify-between p-1  bg-white ${
        status === 'NOT_STARTED' && 'hidden'
      }`}
    >
      {/* Left Icon + Title + Description */}
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-full bg-muted">
          <ArrowLeftRight className="text-muted-foreground w-8 h-8" />
        </div>
        <div className="flex flex-col">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="font-semibold text-sm text-foreground truncate w-20">
                    {beneficiaryGroupName}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="font-semibold text-sm text-foreground ">
                    {beneficiaryGroupName}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Badge
              className={`text-[10px] text-muted-foreground ${isCompleteBgStatus(
                status as string,
              )}`}
            >
              {status
                ?.toLowerCase()
                .replace(/_/g, ' ')
                .replace(/^./, (char) => char.toUpperCase())}
            </Badge>
          </div>

          <div className=" flex text-sm text-muted-foreground mt-2">
            {actions}
            {actions === 'CVA' && merchentName === 'OFFLINE' && (
              <>
                <Dot />
                {vendorName}
              </>
            )}
            <Dot />

            <Badge className="text-xs text-muted-foreground">
              {merchentName
                .toLowerCase()
                .replace(/_/g, ' ')
                .replace(/^./, (char) => char.toUpperCase())}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {beneficiariesCount} beneficiaries
          </div>
        </div>
      </div>

      {/* Date and Time */}
      <div className="text-sm text-muted-foreground whitespace-nowrap">
        {dateFormat(dateTime)}
      </div>
      {/* View Icon */}
      <button onClick={onView}>
        <Eye className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
}
