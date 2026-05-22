import DashboardMap from '../dashboard/map';

type MapData = {
  component: any;
  actualData: any;
};

const MapWrapper = ({ actualData, component }: MapData) => {
  if (!Array.isArray(actualData)) return null;

  const mapStatsData = actualData?.find(
    (d: any) => d.name === component?.dataMap,
  );

  if (!mapStatsData) return null;

  return <DashboardMap coordinates={mapStatsData?.data} />;
};

export default MapWrapper;
