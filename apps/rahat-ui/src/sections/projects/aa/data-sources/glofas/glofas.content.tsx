import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

const getCellColor = (cell: string) => {
  const cellValue = cell ? Number(cell) : 0;
  if (cellValue >= 30 && cellValue < 50) {
    return 'bg-yellow-100';
  }
  if (cellValue >= 50 && cellValue < 70) {
    return 'bg-yellow-200';
  }
  if (cellValue >= 70) {
    return 'bg-yellow-300';
  }
  return 'bg-green-50';
};

export default function GlofasContent({ location, glofasData }: any) {
  if (!glofasData) {
    return <p>Data not available for GloFAS.</p>;
  }
  const pointForecast = glofasData?.pointForecastData;
  const returnPeriodHeaders =
    glofasData?.returnPeriodTable?.returnPeriodHeaders;

  const returnPeriodData = glofasData?.returnPeriodTable?.returnPeriodData;

  return (
    <ScrollArea className="h-[calc(100vh-215px)]">
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-card p-4 rounded col-span-2">
          <h1 className="font-semibold text-lg mb-4">Point Forecast</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h1 className="text-muted-foreground text-sm">Station</h1>
              <p>{location}</p>
            </div>
            <div className="text-right">
              <h1 className="text-muted-foreground text-sm">
                {pointForecast?.forecastDate?.header}
              </h1>
              <p>{pointForecast?.forecastDate?.data}</p>
            </div>
            <div>
              <h1 className="text-muted-foreground text-sm">
                {pointForecast?.maxProbability?.header}
              </h1>
              <p>{pointForecast?.maxProbability?.data}</p>
            </div>
            <div className="text-right">
              <h1 className="text-muted-foreground text-sm">
                {pointForecast?.alertLevel?.header}
              </h1>
              <p>{pointForecast?.alertLevel?.data}</p>
            </div>
            <div>
              <h1 className="text-muted-foreground text-sm">
                {pointForecast?.maxProbabilityStep?.header}
              </h1>
              <p>{pointForecast?.maxProbabilityStep?.data}</p>
            </div>
            <div className="text-right">
              <h1 className="text-muted-foreground text-sm">
                {pointForecast?.dischargeTendencyImage?.header}
              </h1>
              <p className="flex justify-end">
                <img
                  src={pointForecast?.dischargeTendencyImage?.data}
                  alt="discharge-tendency"
                />
              </p>
            </div>
            <div>
              <h1 className="text-muted-foreground text-sm">
                {' '}
                {pointForecast?.peakForecasted?.header}
              </h1>
              <p> {pointForecast?.peakForecasted?.data}</p>
            </div>
          </div>
        </div>

        <div className="bg-card overflow-hidden p-2 rounded-md col-span-3">
          <img src={glofasData?.hydrographImageUrl} alt="hydrograph-chart" />
        </div>

        <div className="bg-card p-4 rounded col-span-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-semibold text-lg">{'ECMWF-ENS > 2 yr RP'}</h1>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  {returnPeriodHeaders.map((header: string, index: number) => (
                    <th
                      className="p-2 border border-gray-300 bg-gray-100 text-center text-xs font-semibold text-gray-600"
                      key={index}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {returnPeriodData.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => {
                      let bgColor;
                      if (cellIndex > 0) {
                        bgColor = getCellColor(cell);
                      }

                      return (
                        <td
                          className={`p-2 border border-gray-200 text-center text-sm text-gray-700 ${bgColor}`}
                          key={cellIndex}
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
