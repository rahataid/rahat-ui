import { LineChart } from '@rahat-ui/shadcn/src/components/charts';
import DHMMap from './map';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import DHMBulletinDialog from './dhm.bulletin.edit.dialog';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { StyledMapWrapper } from '@rahat-ui/shadcn/src/components/maps';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';

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
      className={`${status === 'activation'
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

const getLineChartCategories = (t: (key: string) => string) => [
  t('JAN'),
  t('FEB'),
  t('MAR'),
  t('APR'),
  t('MAY'),
  t('JUN'),
  t('JUL'),
  t('AUG'),
  t('SEP'),
];

export default function DHMContent({ data, dhmDangerLevel }: any) {
  const t = useTranslations('AA Project');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();

  console.log(dhmDangerLevel)

  if (!data?.length) {
    return <p>{t('DATA_NOT_AVAILABLE_DHM')}</p>;
  }

  const latestData = data[0];

  const dhmData = data;

  const xAxisLabel = dhmData?.map((d: any) => {
    return formatDate(d?.data?.waterLevelOn, 'hh:mm a');
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
        text: t('TIME'),
      },
    },
    yaxis: {
      title: {
        text: t('WATER_LEVEL'),
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

  if (dhmDangerLevel) {
    chartOptions?.annotations?.yaxis?.push({
      y: dhmDangerLevel,
      borderColor: '#D2042D',
      borderWidth: 2,
      label: {
        style: {
          color: '#D2042D',
        },
        text: t('DANGER_LEVEL'),
      },
    });
  }


  const waterLevelData = dhmData?.map((d: any) => {
    return parseFloat(d.data.waterLevel).toFixed(2);
  });

  const seriesData = [
    {
      name: t('WATER_LEVEL'),
      data: waterLevelData.reverse(),
    },
  ];

  return (
    <ScrollArea className="h-[calc(100vh-215px)]">
      <div className="grid grid-cols-5 gap-4">
        <StyledMapWrapper className="relative col-span-3 rounded-md 2xl:h-[400px] overflow-hidden">
          <DHMMap
            basin={latestData?.data?.basin}
            lat={latestData?.data?.point?.coordinates[1]}
            lng={latestData?.data?.point?.coordinates[0]}
            status={latestData?.data?.status}
          />
        </StyledMapWrapper>
        <div className="bg-card p-4 rounded col-span-2">
          <h1 className="font-semibold text-lg mb-4">{t('REAL_TIME_STATUS')}</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h1 className="text-muted-foreground text-sm">{t('STATION')}</h1>
              <p>{latestData.data.title}</p>
            </div>
            <div className="text-right">
              <h1 className="text-muted-foreground text-sm">{t('BASIN')}</h1>
              <p>{latestData.data.basin}</p>
            </div>
            <div>
              <h1 className="text-muted-foreground text-sm">{t('WATER_LEVEL')}</h1>
              <p>{formatNum(parseFloat(latestData.data.waterLevel))}</p>
            </div>
            <div className="text-right">
              <h1 className="text-muted-foreground text-sm">{t('WATER_LEVEL_ON')}</h1>
              <p>{formatDate(latestData.data.waterLevelOn)}</p>
            </div>
            <div>
              <h1 className="text-muted-foreground text-sm">{t('LONGITUDE')}</h1>
              <p>{formatNum(parseFloat(longitude))}</p>
            </div>
            <div className="text-right">
              <h1 className="text-muted-foreground text-sm">{t('LATITUDE')}</h1>
              <p>{formatNum(parseFloat(latitude))}</p>
            </div>
            <div className="col-span-2">
              <h1 className="text-muted-foreground text-sm">{t('DESCRIPTION')}</h1>
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
          <h1 className="p-4 pb-2 font-semibold text-lg">{t('WATER_LEVEL_STATS')}</h1>
          <LineChart
            categories={getLineChartCategories(t)}
            series={seriesData}
            lineChartOptions={chartOptions}
          />
        </div>
      </div>
    </ScrollArea>
  );
}
