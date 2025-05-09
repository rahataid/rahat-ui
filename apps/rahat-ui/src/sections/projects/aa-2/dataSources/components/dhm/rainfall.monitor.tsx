import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Heading } from 'apps/rahat-ui/src/common';
import { MapPin, Radio } from 'lucide-react';

interface RainFallMonitorProps {
  name: string;
  description: string;
  warningStatus: string;
  stationIndex: string;
  district: string;
  timeIntervals: {
    hours: number;
    warningLevel: number;
  }[];
}

export function RainFallMonitor({
  name,
  description,
  warningStatus,
  stationIndex,
  district,
  timeIntervals,
}: RainFallMonitorProps) {
  return (
    <div className="p-4 rounded-sm border shadow flex justify-between space-x-4 ">
      <div className="flex-[1]">
        <div className=" flex  gap-4 ">
          <Heading
            title={name}
            titleStyle="text-xl/6 font-semibold"
            description={description}
          />
          <div>
            <Badge
              className={`text-xs font-normal  py-1 px-auto rounded-full min-w-[160px] text-center whitespace-nowrap${
                warningStatus === 'BELOW WARNING LEVEL'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-500'
              }`}
            >
              {warningStatus?.charAt(0).toUpperCase() +
                warningStatus?.slice(1).toLowerCase() || 'N/A'}
            </Badge>
          </div>
        </div>
        <div className="flex mt-4 text-sm gap-6">
          <div className="flex items-center mr-8">
            <Radio className="w-4 h-4 mr-2 text-gray-500" />
            <div>
              <div className="text-gray-600">Station Index</div>
              <div>{stationIndex}</div>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <div>
              <div className="text-gray-600">District</div>
              <div>{district}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-[2] md:flex-[3] p-4 ">
        <div className="border grid grid-cols-5 rounded-sm shadow-sm p-4">
          {timeIntervals.map((interval, index) => (
            <div key={index} className="p-4   text-center">
              <div className="text-primary font-semibold">
                {interval.warningLevel !== undefined
                  ? `${interval.warningLevel}mm`
                  : 'N/A'}
              </div>
              <div className="text-sm mt-1">
                {interval.hours} {interval.hours === 1 ? 'hour' : 'hours'}
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Warning Level:{' '}
                {interval?.hours === 1
                  ? '60'
                  : interval?.hours === 3
                  ? '80'
                  : interval?.hours === 6
                  ? '100'
                  : interval?.hours === 12
                  ? '120'
                  : '140'}
                mm
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
