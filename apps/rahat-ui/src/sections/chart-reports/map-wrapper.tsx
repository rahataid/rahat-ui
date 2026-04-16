import DashboardMap from '../dashboard/map';

type MapData = {
  component: any;
  actualData: any;
};

const MapWrapper = ({ actualData, component }: MapData) => {
  // Handle both array and object with nested benefStats array
  const dataArray = Array.isArray(actualData)
    ? actualData
    : actualData?.benefStats || [];

  const mapStatsData = dataArray?.find(
    (d: any) => d.name === component?.dataMap,
  );

  if (mapStatsData) return <DashboardMap coordinates={mapStatsData?.data} />;
};

export default MapWrapper;
