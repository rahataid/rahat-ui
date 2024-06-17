import { StyledMapContainer, THEMES } from '@rahat-ui/shadcn/maps';
import { mapboxBasicConfig } from 'apps/rahat-ui/src/constants/config';
import { LineChart } from '@rahat-ui/shadcn/src/components/charts';
import DHMMap from './map';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import DHMBulletinDialog from './dhm.bulletin.edit.dialog';

const renderStatus = ({ readinessLevel, activationLevel, waterLevel }: any) => {
  let status;
  if (waterLevel >= activationLevel) {
    status = 'activation';
  } else if (waterLevel >= readinessLevel) {
    status = 'readiness';
  } else {
    status = 'safe';
  }

  return (
    <p
      className={`${
        status === 'activation'
          ? 'text-red-500'
          : status === 'readiness'
          ? 'text-yellow-500'
          : 'text-green-500'
      }`}
    >
      {status === 'activation'
        ? 'Water is in activation level'
        : status === 'readiness'
        ? 'Water is in readiness level'
        : 'Water is in a safe level'}
    </p>
  );
};

const LINE_CHART_CATEGORIES=[
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
]

export default function DHMContent({ data }: any) {
  if (!data?.length) {
    return <p>Data not available for DHM.</p>;
  }

  const latestData = data[0];

  const dhmData = data;

  const xAxisLabel = dhmData?.map((d: any) => {
    const date = new Date(d?.data?.waterLevelOn);
    return date.toLocaleTimeString();
  });

  // do not remove
  // const readinessLevel = dhmStatements?.find(
  //   (d: any) => d?.triggerStatement?.readinessLevel,
  // )?.triggerStatement?.readinessLevel;
  // const activationLevel = dhmStatements?.find(
  //   (d: any) => d?.triggerStatement?.activationLevel,
  // )?.triggerStatement?.activationLevel;

  const longitude = latestData.data.point.coordinates[0];
  const latitude = latestData.data.point.coordinates[1];

  const chartOptions: ApexCharts.ApexOptions = {
    xaxis: {
      categories: xAxisLabel.reverse(),
      title: {
        text: 'Time',
      },
    },
    yaxis: {
      title: {
        text: 'Water Level',
      },
      max: 12,
    },
    annotations: {
      yaxis: [],
    },
    tooltip: {
      x: {
        show: false,
      },
      marker: { show: false },
    },
    dataLabels: {
      enabled: true,
    },
  };

  // do not remove
  // if (activationLevel) {
  //   chartOptions?.annotations?.yaxis?.push({
  //     y: activationLevel,
  //     borderColor: '#D2042D',
  //     borderWidth: 2,
  //     label: {
  //       style: {
  //         color: '#D2042D',
  //       },
  //       text: 'Activation Level',
  //     },
  //   });
  // }

  // if (readinessLevel) {
  //   chartOptions?.annotations?.yaxis?.push({
  //     y: readinessLevel,
  //     borderColor: '#FFC300',
  //     borderWidth: 2,
  //     label: {
  //       style: {
  //         color: '#FFC300',
  //       },
  //       text: 'Readiness Level',
  //     },
  //   });
  // }

  const waterLevelData = dhmData?.map((d: any) => {
    return parseFloat(d.data.waterLevel).toFixed(2);
  });

  const seriesData = [
    {
      name: 'Water Level',
      data: waterLevelData.reverse(),
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 h-[calc(100vh-215px)]">
      <div className="overflow-hidden rounded-md col-span-3">
        <StyledMapContainer>
          <DHMMap
            coordinates={[longitude, latitude]}
            {...mapboxBasicConfig}
            mapStyle={THEMES.outdoors}
          />
        </StyledMapContainer>
      </div>

      <div className="bg-card p-4 rounded col-span-2">
        <h1 className="font-semibold text-lg mb-4">Real Time Status</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h1 className="text-muted-foreground text-sm">Station</h1>
            <p>{latestData.data.title}</p>
          </div>
          <div className="text-right">
            <h1 className="text-muted-foreground text-sm">Basin</h1>
            <p>{latestData.data.basin}</p>
          </div>
          <div>
            <h1 className="text-muted-foreground text-sm">Water Level</h1>
            <p>{parseFloat(latestData.data.waterLevel).toFixed(2)}</p>
          </div>
          <div className="text-right">
            <h1 className="text-muted-foreground text-sm">Water Level On</h1>
            <p>{new Date(latestData.data.waterLevelOn).toLocaleString()}</p>
          </div>
          <div>
            <h1 className="text-muted-foreground text-sm">Longitude</h1>
            <p>{parseFloat(longitude).toFixed(2)}</p>
          </div>
          <div className="text-right">
            <h1 className="text-muted-foreground text-sm">Latitude</h1>
            <p>{parseFloat(latitude).toFixed(2)}</p>
          </div>
          <div>
            <h1 className="text-muted-foreground text-sm">Description</h1>
            <p>{latestData.data.description}</p>
          </div>
          {/* do not remove */}
          {/* <div className="text-right">
            {renderStatus({
              readinessLevel: readinessLevel,
              activationLevel: activationLevel,
              waterLevel: latestData.data.waterLevel,
            })}
          </div> */}
        </div>
      </div>

      {/* <div className="bg-card p-4 rounded col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-semibold text-lg">Bulletin Today</h1>
          <DHMBulletinDialog />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h1 className="text-muted-foreground text-sm">Waterway</h1>
            <p>Test</p>
          </div>
          <div className="text-right">
            <h1 className="text-muted-foreground text-sm">River</h1>
            <p>Test</p>
          </div>
          <div>
            <h1 className="text-muted-foreground text-sm">(2080-01-12)</h1>
            <p>Today</p>
            <Badge className="bg-green-100 text-green-600">Normal</Badge>
          </div>
          <div className="text-right">
            <h1 className="text-muted-foreground text-sm">(2080-01-13)</h1>
            <p>Tomorrow</p>
            <Badge className="bg-orange-100 text-orange-500">
              Notable increase
            </Badge>
          </div>
          <div>
            <h1 className="text-muted-foreground text-sm">(2080-01-14)</h1>
            <Badge className="bg-green-100 text-green-600">Normal</Badge>
          </div>
        </div>
      </div> */}

      <div className="bg-card rounded-md col-span-5">
        <h1 className="p-4 pb-2 font-semibold text-lg">Water Level Stats</h1>
        <LineChart categories={LINE_CHART_CATEGORIES} series={seriesData} lineChartOptions={chartOptions} />
      </div>
    </div>
  );
}
