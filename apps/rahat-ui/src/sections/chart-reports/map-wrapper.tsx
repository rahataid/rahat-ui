import DashboardMap from '../dashboard/map';

type MapData = {
  component: any;
  actualData: any;
};

const MapWrapper = ({ actualData, component }: MapData) => {
  const mapStatsData = actualData?.find(
    (d: any) => d.name === component?.dataMap,
  );

  if (mapStatsData)
    return (
      <>
        <p className="font-bold text-lg text-primary mb-2">
          {component?.title}
        </p>
        <DashboardMap coordinates={mapStatsData?.data} />
      </>
    );
};

export default MapWrapper;
