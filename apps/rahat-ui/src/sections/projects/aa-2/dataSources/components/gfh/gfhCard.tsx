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
const InfoModal = React.lazy(
  () => import('apps/rahat-ui/src/components/infoModal'),
);
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';

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
  const googleFloodHubInfoModal = useBoolean();

  const handleAssignModalClick = () => {
    googleFloodHubInfoModal.onTrue();
  };

  return (
    <>
      <InfoModal
        removeModal={googleFloodHubInfoModal}
        title="Gauge thresholds"
        description="The historical and forecasted river levels. The risk level is determined by comparing the forecast with the predefined thresholds (based on past flood events)."
      >
        <a
          target="_blank"
          href="https://support.google.com/flood-hub/answer/15636998"
          className="text-blue-500 hover:text-blue-700 text-sm font-medium inline-block"
        >
          Learn More
        </a>
      </InfoModal>

      <Card className="px-4 py-3 rounded-xl mb-4">
        {/* title */}
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-bold text-lg">Doda River Forecast</h2>
          <CircleAlert
            className="w-4 h-4 cursor-pointer"
            onClick={handleAssignModalClick}
          />
        </div>
        <div className="flex flex-wrap justify-between gap-4">
          {/* River Gauge Id */}
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">River Gauge ID</p>
              <p className="text-sm text-gray-600">{riverGaugeId || 'N/A'}</p>
            </div>
          </div>

          {/* Source */}
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium ">Source</p>
              <p className="text-sm text-gray-600">{source || 'N/A'}</p>
            </div>
          </div>

          {/* Latitude */}
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium ">Latitude</p>
              <p className="text-sm text-gray-600">{latitude || 'N/A'}</p>
            </div>
          </div>

          {/* Longitude */}
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium ">Longitude</p>
              <p className="text-sm text-gray-600">{longitude || 'N/A'}</p>
            </div>
          </div>

          {/* Gauge Station Name */}
          <div className="flex items-center gap-3">
            <RadioTower className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium ">Gauge Station Name</p>
              <p className="text-sm text-gray-600">{stationName || 'N/A'}</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium ">Date</p>
              <p className="text-sm text-gray-600">
                {dateFormat(forecastDate, 'eee, MMMM d, yyyy') || 'N/A'}
              </p>
            </div>
          </div>

          {/* Basin Size */}
          {/* <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Basin Size (km³)</p>
              <p className="text-sm text-gray-600">{basinSize || 'N/A'}</p>
            </div>
          </div> */}
        </div>
      </Card>
    </>
  );
};

export default GFHCard;
