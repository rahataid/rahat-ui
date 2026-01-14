import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import React from 'react';
import { calculateRemainingTriggers } from '../utils';

interface IProps {
  title: string;
  color: string;
  bgColor: string;
  totalTriggers: number;
  totalTriggered: number;
  totalRequiredTriggers: number;
}

const TriggerDetailsCard = ({
  title,
  color,
  bgColor,
  totalTriggers,
  totalTriggered,
  totalRequiredTriggers,
}: IProps) => {
  return (
    <div className={`${bgColor} rounded p-4 space-y-1`}>
      <p className="text-sm/4">{title} Triggers</p>
      <div className="flex items-center gap-1">
        <p className={`text-2xl font-medium text-${color}-500`}>
          {totalTriggered}
        </p>
        <p className="text-gray-500">triggered</p>
      </div>
      <div>
        <div
          className={`bg-slate-50 p-2 rounded text-sm/4 text-gray-500 space-y-1`}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-black">Station</p>
            <Badge
              className={`bg-${color}-500 text-white font-extralight tracking-wider px-1`}
            >
              {totalTriggered}/{totalRequiredTriggers}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p>Total Triggers</p>
            <p className="text-gray-700">{totalTriggers}</p>
          </div>

          <div className="flex items-center justify-between">
            <p>Required</p>
            <p className="text-gray-700">{totalRequiredTriggers}</p>
          </div>

          <div className="flex items-center justify-between">
            <p>Remaining</p>
            <p className="text-gray-700">
              {calculateRemainingTriggers(
                totalRequiredTriggers,
                totalTriggered,
              )}
            </p>
          </div>
        </div>
        {/* this code can be useful latter */}
        {/* <Progress
                value={Math.floor(
                  (triggeredMandatoryTriggers / mandatoryTriggers) * 100,
                )}
                className="h-2"
                indicatorColor={'bg-[#297AD6]'}
              /> */}
      </div>
    </div>
  );
};

export default TriggerDetailsCard;
