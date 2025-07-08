import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Calendar, FileText, RadioTower, User } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';

interface IGaugeForecastCardProps {
  date?: string | null;
  station?: string | null;
  riverBasin?: string;
  gaugeForecast?: string | null;
  latestGaugeReading?: number;
  dataEntryBy?: string | null;
  unit?: string;
}

const GaugeForecastCard = ({
  riverBasin,
  gaugeForecast,
  station,
  dataEntryBy,
  date,
  latestGaugeReading,
  unit,
}: IGaugeForecastCardProps) => {
  return (
    <Card className="px-4 py-3 rounded-xl mb-4">
      <div className="grid grid-cols-4 gap-4 items-center">
        {/* River Information */}
        <div className="md:col-span-1">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="font-medium text-lg text-gray-900 truncate max-w-[140px] cursor-default">
                    {riverBasin}
                  </h3>
                </TooltipTrigger>
                <TooltipContent className="z-50" side="top">
                  <p>{riverBasin}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {(gaugeForecast && (
              <Badge className="h-fit text-sm text-center font-normal">
                {gaugeForecast === 'riverWatch'
                  ? 'River Watch'
                  : 'Rainfall Watch'}
              </Badge>
            )) ||
              'N/A'}
          </div>
          <div className="flex items-center gap-2">
            <RadioTower className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Station</p>
              <p className="text-sm text-gray-600">{station || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Created By */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Created By</p>
              <p className="text-sm text-gray-600">{dataEntryBy || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Created Date */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Created Date</p>
              <p className="text-sm text-gray-600">{date || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Gauge Reading */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Gauge Reading</p>
              <p className="text-sm text-gray-600">
                {latestGaugeReading ? `${latestGaugeReading} ${unit}` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GaugeForecastCard;
