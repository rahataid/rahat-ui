import { BarChart, PieChart } from '@rahat-ui/shadcn/src/components/charts';
import { FC, useEffect, useState } from 'react';
import DataCard from './datacard';
import ErrorBoundary from '../../utils/error-boundary';
import {
  getValueFromPath,
  mapObjectKeyValue,
} from '../../utils/extractObjetInfo';
import getIcon from '../../utils/getIcon';

type DataSource = {
  type: 'stats' | 'url' | 'blockchain';
  args: { [key: string]: any };
  data: any;
};

type UIComponent = {
  title: string;
  type: 'dataCard' | 'pie' | 'bar' | 'stacked_bar';
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

    console.log(title, {
      type,
      title,
      props,
      dataSrc,
      colSpan,
      source,
      dataMap,
      actualData,
    });
    const cardDataValue =
      type === 'dataCard' && dataMap && actualData
        ? getValueFromPath(actualData, dataMap)
        : null;

    const piechartDataValue =
      type === 'pie' && dataMap
        ? (mapObjectKeyValue(actualData?.[dataMap], ['label', 'value']) as {
            label: string;
            value: number;
          }[])
        : [];

    switch (type) {
      case 'dataCard':
        console.log('data', cardDataValue);
        return (
          <ErrorBoundary>
            <DataCard
              Icon={getIcon(props?.icon) || null}
              number={cardDataValue}
              {...(props as { title: string })}
            />
          </ErrorBoundary>
        );

      case 'pie':
        return (
          <ErrorBoundary>
            {piechartDataValue && (
              <PieChart
                title={title}
                chart={{
                  series: piechartDataValue,
                }}
                {...props}
              />
            )}
          </ErrorBoundary>
        );

      case 'bar':
        return (
          <ErrorBoundary>
            {actualData?.[dataMap] && (
              <BarChart
                categories={Object.keys(actualData?.[dataMap])}
                series={Object.values(actualData?.[dataMap])}
              />
            )}
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
      {ui.map((row, index) => renderUIRow(row, index))}
    </div>
  );
};

export default DynamicReports;
