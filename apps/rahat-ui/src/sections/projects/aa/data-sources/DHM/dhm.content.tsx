import { StyledMapContainer, THEMES } from '@rahat-ui/shadcn/maps';
import { mapboxBasicConfig } from 'apps/rahat-ui/src/constants/config';
import { LineChart } from '@rahat-ui/shadcn/src/components/charts';
import DHMMap from './map';

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
    <div>
      <p
        className={`mt-4 sm:mt-8 sm:w-2/3 ${
          status === 'activation'
            ? 'text-red-500'
            : status === 'readiness'
            ? 'text-yellow-500'
            : 'text-green-500'
        }`}
      >
        {status === 'activation'
          ? 'Water is in activation level!'
          : status === 'readiness'
          ? 'Water is in readiness level!'
          : 'Water is in a safe level.'}
      </p>
    </div>
  );
};

export default function DHMContent({ data }: any) {
  if (!data?.length) {
    return <p>Data not available for DHM.</p>;
  }

  const latestData = data[0];
  console.log(latestData);
  const dhmData = data;

  const xAxisLabel = dhmData.map((d: any) => {
    const date = new Date(d.createdAt);
    return date.toLocaleTimeString();
  });

  const activationLevel = latestData.trigger.triggerStatement.activationLevel;
  const readinessLevel = latestData.trigger.triggerStatement.readinessLevel;
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
      yaxis: [
        {
          y: activationLevel,
          borderColor: '#D2042D',
          borderWidth: 2,
          label: {
            style: {
              color: '#D2042D',
            },
            text: 'Activation Level',
          },
        },
        {
          y: readinessLevel,
          borderColor: '#FFC300',
          borderWidth: 2,
          label: {
            style: {
              color: '#FFC300',
            },
            text: 'Readiness Level',
          },
        },
      ],
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

  const waterLevelData = dhmData.map((d: any) => {
    return parseFloat(d.data.waterLevel).toFixed(2);
  });

  const seriesData = [
    {
      name: 'Water Level',
      data: waterLevelData.reverse(),
    },
  ];

  console.log();

  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="h-[calc(100vh-130px)] col-span-3 flex flex-col gap-2">
        <div className="h-1/2 overflow-hidden rounded-md">
          <StyledMapContainer>
            <DHMMap
              coordinates={[longitude, latitude]}
              {...mapboxBasicConfig}
              mapStyle={THEMES.light}
            />
          </StyledMapContainer>
        </div>
        <div className="h-1/2 bg-card rounded-md">
          <LineChart series={seriesData} lineChartOptions={chartOptions} />
        </div>
      </div>
      <div className="grid grid-rows-3 gap-2 h-full">
        <div className="bg-card p-4 rounded">
          <h1 className="font-semibold text-lg">Real Time Status</h1>
          <p>Station: {latestData.data.title}</p>
          <p>Basin: {latestData.data.basin}</p>
          <p>
            Water Level: {parseFloat(latestData.data.waterLevel).toFixed(2)}
          </p>
          <p>
            Water Level On:{' '}
            {new Date(latestData.data.waterLevelOn).toLocaleString()}
          </p>
          <p>Longitude: {parseFloat(longitude).toFixed(2)}</p>
          <p>Latitude: {parseFloat(latitude).toFixed(2)}</p>
          <p>Description: {latestData.data.description}</p>
        </div>
        <div className="bg-card p-4 rounded">
          <h1 className="font-semibold text-lg">Bulletin Today</h1>
          <p>Station: N/A</p>
          <p>Basin: N/A</p>
          <p>Status: N/A</p>
          <p>Warning Level: N/A</p>
          <p>Flow: N/A</p>
          <p>Longitude: N/A</p>
          <p>Latitude: N/A</p>
          <p>Description: N/A</p>
        </div>
        <div className="bg-card p-4 rounded">
          <h1 className="font-semibold text-lg">
            Water Level: {parseFloat(latestData.data.waterLevel).toFixed(2)}
          </h1>
          <h1 className="font-semibold text-lg">
            <div>
              Activation Level:{' '}
              {latestData.trigger.triggerStatement.activationLevel}
            </div>
            <div>
              Readiness Level:{' '}
              {latestData.trigger.triggerStatement.readinessLevel}
            </div>
          </h1>
          {renderStatus({
            readinessLevel: readinessLevel,
            activationLevel: activationLevel,
            waterLevel: latestData.data.waterLevel,
          })}
          {/* <h1 className='font-semibold text-lg'>Phase: Readiness</h1> */}
        </div>
      </div>
    </div>
  );
}
