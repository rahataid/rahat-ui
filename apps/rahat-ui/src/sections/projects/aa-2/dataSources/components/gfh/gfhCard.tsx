import React from 'react';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Calendar,
  FileText,
  Globe,
  CircleAlert,
  RadioTower,
} from 'lucide-react';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';

interface IGFHCardProps {
  riverGaugeId: string;
  source: string;
  latitude: string;
  longitude: string;
  stationName: string;
  forecastDate: string;
  basinSize: string;
}

const GFHCard = ({
  riverGaugeId,
  source,
  latitude,
  longitude,
  stationName,
  forecastDate,
  basinSize,
}: IGFHCardProps) => {
  return (
    <Card className="px-4 py-3 rounded-xl mb-4">
      {/* title */}
      <div className="flex items-center gap-2 mb-3">
        <h2 className="font-bold text-lg">Sarda River Forecast</h2>
        <CircleAlert className="w-4 h-4" />
      </div>
      <div className="grid grid-cols-6 gap-4">
        {/* River Gauge Id */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">River Gauge Id</p>
              <p className="text-sm text-gray-600">{riverGaugeId || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Source */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium ">Source</p>
              <p className="text-sm text-gray-600">{source || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Latitude/Longitude */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium ">Latitude/Longitude</p>
              <p className="text-sm text-gray-600">
                {latitude || 'N/A'}/{longitude || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Gauge Station Name */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <RadioTower className="w-6 h-6 text-gray-500" />
            <div>
              <p className="text-sm font-medium ">Gauge Station Name</p>
              <p className="text-sm text-gray-600">{stationName || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium ">Date</p>
              <p className="text-sm text-gray-600">
                {dateFormat(forecastDate, 'eee, MMMM d, yyyy') || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Basin Size */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Basin Size (km³)</p>
              <p className="text-sm text-gray-600">{basinSize || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GFHCard;
