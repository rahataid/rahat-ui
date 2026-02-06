import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { LucideIcon } from 'lucide-react';

type IProps = {
  handleOnClick: VoidFunction;
  Icon: LucideIcon;
  tip: string;
  iconStyle?: string;
  disable?: boolean;
};

export default function TooltipComponent({
  handleOnClick,
  Icon,
  tip,
  iconStyle = '',
  disable = false,
}: IProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger onClick={handleOnClick} disabled={disable}>
          <Icon className={iconStyle} size={20} strokeWidth={2.5} />
        </TooltipTrigger>
        <TooltipContent className="bg-secondary ">
          <p className="text-xs font-medium">{tip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
