import {
  BarChart,
  ChartColumnStacked,
  PieChart,
} from '@rahat-ui/shadcn/src/components/charts';
import { FC, useEffect, useState } from 'react';
import DataCard from '../../components/dataCard';
import ErrorBoundary from '../../utils/error-boundary';
import getIcon from '../../utils/getIcon';
import { formatUnderScoredString } from '../../utils/string';

const fetchData = async (
  url: string,
): Promise<number[] | null | Record<string, any>[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

type ReportData = {
  name: string;
  data: number | string | Record<string, any>[];
};

type UIComponent = {
  name: string;
  title: string;
  type: 'pie' | 'bar' | 'datacard' | 'stacked_bar' | string;
  icon?: string;
};

type DynamicReportProps = {
  data: ReportData[];
  ui: UIComponent[][];
  className?: string;
};

type DynamicData = {
  [key: string]: number[];
};

const DynamicReports: FC<DynamicReportProps> = ({ data, ui, className }) => {
  const [dynamicData, setDynamicData] = useState<DynamicData>({});

  useEffect(() => {
    const fetchDynamicData = async () => {
      const dynamicReports = data.filter(
        // check if string is a url
        (report) =>
          typeof report.data === 'string' && report.data.startsWith('http'),
      );
      const fetchedData = await Promise.all(
        dynamicReports.map((report) => fetchData(report.data as string)),
      );

      const dataMap = dynamicReports.reduce((acc, report, index) => {
        if (report.name && fetchedData[index]) {
          if (Array.isArray(fetchedData[index])) {
            const formattedData = fetchedData[index].reduce(
              (dataAcc, item, itemIndex) => {
                const itemName = `${report.name}.${item.name}`;
                const itemData = item.data;
                dataAcc[itemName] = Array.isArray(itemData)
                  ? itemData.map((d) => ({
                      ...d,
                      label: formatUnderScoredString(d.id),
                      value: d.count,
                    }))
                  : itemData;
                return dataAcc;
              },
              {} as DynamicData,
            );
            acc = { ...acc, ...formattedData };
          } else {
            acc[report.name] = fetchedData[index] as number[];
          }
        }
        return acc;
      }, {} as DynamicData);

      setDynamicData(dataMap);
    };

    fetchDynamicData();
  }, [data]);

  const renderUIReport = (data: ReportData[], ui: UIComponent[][]) => {
    return ui.map((row, rowIndex) => (
      <div key={rowIndex} className={`grid grid-cols-${row.length} gap-2 mt-2`}>
        {row.map((col, colIndex) => {
          const combinedData = data.concat(
            Object.keys(dynamicData).map((key) => ({
              name: key,
              data: dynamicData[key] as string | number | Record<string, any>[],
            })),
          );
          const reportData = combinedData.find((d) => d.name === col.name);
          const actualData =
            typeof reportData?.data === 'string' &&
            reportData?.data.startsWith('http')
              ? dynamicData[col.name]
              : (reportData?.data as any);

          // TODO: consider for the nested api resposes as well
          let component: JSX.Element | null = null;

          switch (col.type) {
            case 'pie':
              component = (
                <ErrorBoundary>
                  <PieChart
                    key={colIndex}
                    title={formatUnderScoredString(col.title)}
                    // title={formatUnderScoredString(col.name)}
                    chart={{ series: actualData as number[] }}
                  />
                </ErrorBoundary>
              );
              break;
            case 'bar':
              component = (
                <ErrorBoundary>
                  <BarChart
                    key={colIndex}
                    title={col.title}
                    series={actualData as number[]}
                  />
                </ErrorBoundary>
              );
              break;
            case 'datacard':
              component =
                actualData !== undefined && actualData !== null ? (
                  <ErrorBoundary>
                    <DataCard
                      key={colIndex}
                      title={col.title}
                      Icon={getIcon(col.icon as string) || null}
                      className="min-h-20 min-w-32 rounded-sm"
                      number={
                        typeof actualData === 'string' ||
                        typeof actualData === 'number'
                          ? (actualData as string)
                          : (actualData?.count as unknown as string)
                      }
                    />
                  </ErrorBoundary>
                ) : (
                  <ErrorBoundary>
                    <div key={colIndex}>Loading...</div>
                  </ErrorBoundary>
                );
              break;
            case 'stacked_bar':
              component = (
                <ChartColumnStacked
                  key={colIndex}
                  title={col.title}
                  series={actualData as number[]}
                />
              );
              break;
          }

          return <div key={colIndex}>{component}</div>;
        })}
      </div>
    ));
  };

  return <div>{renderUIReport(data, ui)}</div>;
};

export default DynamicReports;
