import React, { FC, useEffect, useState } from 'react';
import {
  PieChart,
  BarChart,
  ChartColumnStacked,
} from '@rahat-ui/shadcn/src/components/charts';
import DataCard from '../../components/dataCard';
import { formatUnderScoredString } from '../../utils/string';
import ErrorBoundary from '../../utils/error-boundary';

const fetchData = async (url: string): Promise<number[] | null> => {
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
  data: number[] | string;
};

type UIComponent = {
  name: string;
  title: string;
  type: 'pie' | 'bar' | 'datacard' | 'stacked_bar';
};

type DynamicReportProps = {
  data: ReportData[];
  ui: UIComponent[][];
};

type DynamicData = {
  [key: string]: number[];
};

const DynamicReports: FC<DynamicReportProps> = ({ data, ui }) => {
  const [dynamicData, setDynamicData] = useState<DynamicData>({});

  useEffect(() => {
    const fetchDynamicData = async () => {
      const dynamicReports = data.filter(
        (report) => typeof report.data === 'string',
      );
      const fetchedData = await Promise.all(
        dynamicReports.map((report) => fetchData(report.data as string)),
      );

      const dataMap = dynamicReports.reduce((acc, report, index) => {
        if (report.name && fetchedData[index]) {
          acc[report.name] = fetchedData[index] as number[];
        }
        return acc;
      }, {} as DynamicData);

      setDynamicData(dataMap);
    };

    fetchDynamicData();
  }, [data]);

  const renderUIReport = (data: ReportData[], ui: UIComponent[][]) => {
    return ui.map((row, rowIndex) => (
      <div key={rowIndex} className={`grid grid-cols-${row.length} gap-4 m-4`}>
        {row.map((col, colIndex) => {
          const reportData = data.find((d) => d.name === col.name);
          const actualData =
            typeof reportData?.data === 'string'
              ? dynamicData[col.name]
              : reportData?.data;

          // TODO: consider for the nested api resposes as well
          let component: JSX.Element | null = null;
          switch (col.type) {
            case 'pie':
              component = (
                <ErrorBoundary>
                  <PieChart
                    key={colIndex}
                    title={col.title}
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
              component = actualData ? (
                <ErrorBoundary>
                  <DataCard
                    key={colIndex}
                    title={col.title}
                    number={actualData as number}
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
