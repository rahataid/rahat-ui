import {
  PROJECT_SETTINGS_KEYS,
  useGlofasWaterLevels,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import GlofasInfoCard from './glofas.info.card';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { NoResult, TableLoader } from 'apps/rahat-ui/src/common';

export function GlofasSection() {
  const params = useParams();
  const projectId = params.id as UUID;

  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));

  const { data: glofasData, isLoading } = useGlofasWaterLevels(projectId, {
    riverBasin:
      settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
      'river_basin'
      ],
    page: 1,
    perPage: 9999,
  });


  const returnPeriodHeaders2yr = React.useMemo(
    () => glofasData?.info?.returnPeriodTable2yr?.returnPeriodHeaders,
    [glofasData],
  );

  const returnPeriodData2yr = React.useMemo(
    () => glofasData?.info?.returnPeriodTable2yr?.returnPeriodData,
    [glofasData],
  );

  const returnPeriodHeaders5yr = React.useMemo(
    () => glofasData?.info?.returnPeriodTable5yr?.returnPeriodHeaders,
    [glofasData],
  );

  const returnPeriodData5yr = React.useMemo(
    () => glofasData?.info?.returnPeriodTable5yr?.returnPeriodData,
    [glofasData],
  );

  const returnPeriodHeaders20yr = React.useMemo(
    () => glofasData?.info?.returnPeriodTable20yr?.returnPeriodHeaders,
    [glofasData],
  );

  const returnPeriodData20yr = React.useMemo(
    () => glofasData?.info?.returnPeriodTable20yr?.returnPeriodData,
    [glofasData],
  );

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
  if (isLoading) {
    return <TableLoader />;
  }

  if (!glofasData) {
    return (
      <div className="p-4">
        <NoResult message="No GLOFAS Data" />
      </div>
    );
  }
  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <GlofasInfoCard glofas={glofasData} />
      <div className="bg-card overflow-hidden p-4 border shadow rounded-sm mt-4">
        <img
          src={glofasData?.info?.hydrographImageUrl}
          alt="hydrograph-chart"
        />
      </div>

      <div className="bg-card p-4 rounded-sm border shadow mt-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-semibold text-lg">{'ECMWF-ENS > 2 yr RP'}</h1>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                {returnPeriodHeaders2yr?.map((header: string, index: number) => (
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
              {returnPeriodData2yr?.map((row: string[], rowIndex: number) => (
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

      {returnPeriodHeaders5yr && returnPeriodData5yr && (
        <div className="bg-card p-4 rounded-sm border shadow mt-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-semibold text-lg">{'ECMWF-ENS > 5 yr RP'}</h1>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  {returnPeriodHeaders5yr?.map((header: string, index: number) => (
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
                {returnPeriodData5yr?.map((row: string[], rowIndex: number) => (
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
      )}

      {returnPeriodHeaders20yr && returnPeriodData20yr && (
        <div className="bg-card p-4 rounded-sm border shadow mt-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-semibold text-lg">{'ECMWF-ENS > 20 yr RP'}</h1>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  {returnPeriodHeaders20yr?.map((header: string, index: number) => (
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
                {returnPeriodData20yr?.map((row: string[], rowIndex: number) => (
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
      )}
    </ScrollArea>
  );
}
