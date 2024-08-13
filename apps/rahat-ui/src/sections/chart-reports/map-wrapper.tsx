import DashboardMap from '../dashboard/map';

type MapData = {
  component: any;
  actualData: any;
};

const MapWrapper = ({ actualData, component }: MapData) => {
  const mapStatsData = actualData?.find(
    (d: any) => d.name === component?.dataMap,
  );

  if (mapStatsData) return <DashboardMap coordinates={mapStatsData?.data} />;
};

export default MapWrapper;
