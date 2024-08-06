import { BarChart, ChartDonut } from '@rahat-ui/shadcn/src/components/charts';
import { FC, useEffect, useState } from 'react';
import DataCard from '../../components/dataCard';
import ErrorBoundary from '../../utils/error-boundary';
import { getValueFromPath } from '../../utils/extractObjetInfo';
import getIcon from '../../utils/getIcon';
import PieChartWrapper from './pie-chart-wrapper';
import DonutWrapper from './donut-wrapper';
import DataCardWrapper from './datacard-wrapper';
import MapWrapper from './map-wrapper';

type DataSource = {
  type: 'stats' | 'url' | 'blockchain';
  args: { [key: string]: any };
  data: any;
};

type UIComponent = {
  title: string;
  type: 'dataCard' | 'pie' | 'bar' | 'stacked_bar' | 'donut' | 'map';
  props: { [key: string]: any };
  dataSrc: string | any;
  dataMap: string | null;
  colSpan: number;
  rowSpan: number;
};

type DynamicReportsProps = {
  dataSources: { [key: string]: DataSource };
  ui: UIComponent[][];
  className?: string;
};

const DynamicReports: FC<DynamicReportsProps> = ({
  dataSources,
  ui,
  className,
}) => {
  const [dynamicData, setDynamicData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchDynamicData = async () => {
      const fetchDataForSource = async (source: string) => {
        const dataSource = dataSources[source];
        let fetchedData: any = null;

        switch (dataSource.type) {
          case 'stats':
            fetchedData = dataSource.data;
            break;
          case 'url':
            try {
              const response = await fetch(dataSource.args.url);
              if (!response.ok) {
                throw new Error(
                  `Failed to fetch data from ${dataSource.args.url}`,
                );
              }
              const res = await response.json();

              fetchedData = res?.data;
            } catch (error) {
              console.error(error);
              fetchedData = null;
            }
            break;
          case 'blockchain':
            // Logic for fetching data from blockchain, not implemented here
            fetchedData = []; // Placeholder for demonstration
            break;
          default:
            fetchedData = null;
        }

        return { source, data: fetchedData };
      };

      const fetchAllData = async () => {
        console.log('dataSources', dataSources);
        const promises = Object.keys(dataSources).map(fetchDataForSource);
        const results = await Promise.all(promises);
        const dataMap: { [key: string]: any } = {};

        results.forEach(({ source, data }) => {
          if (data) {
            dataMap[source] = data;
          }
        });

        setDynamicData(dataMap);
      };

      fetchAllData();
    };
    fetchDynamicData();
  }, [dataSources]);

  const renderUIComponent = (component: UIComponent, dataIndex: number) => {
    const { title, type, props, dataSrc, dataMap, colSpan } = component;
    const actualData = dynamicData[dataSrc];
    const source = dataSources?.[dataSrc];
    console.log('actualData', actualData);

    switch (type) {
      case 'dataCard':
        return (
          <ErrorBoundary>
            <DataCardWrapper
              component={component}
              source={source}
              actualData={actualData}
            />
          </ErrorBoundary>
        );

      case 'pie':
        return (
          <ErrorBoundary>
            {actualData && (
              <PieChartWrapper
                component={component}
                source={source}
                actualData={actualData}
              />
            )}
          </ErrorBoundary>
        );

      case 'bar':
        return (
          <ErrorBoundary>
            {actualData && (
              <BarChart actualData={actualData} component={component} />
            )}
          </ErrorBoundary>
        );

      case 'donut':
        return (
          <ErrorBoundary>
            <DonutWrapper
              component={component}
              source={source}
              actualData={actualData}
            />
          </ErrorBoundary>
        );

      case 'map':
        return (
          <ErrorBoundary>
            <MapWrapper component={component} actualData={actualData} />
          </ErrorBoundary>
        );

      default:
        return null;
    }
  };

  const renderUIRow = (row: UIComponent[], rowIndex: number) => {
    return (
      <div key={rowIndex} className={`grid grid-cols-${row.length} gap-2 mt-2`}>
        {row.map((component, colIndex) => (
          <div
            key={colIndex}
            className={`grid-cols-${component.colSpan} grid-rows-${component.rowSpan}`}
          >
            {renderUIComponent(component, colIndex)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={className}>
      {ui?.map((row, index) => renderUIRow(row, index))}
    </div>
  );
};

export default DynamicReports;
