import DashboardMap from '../dashboard/map';
import { extractDataArray } from '../../utils/extractDataArray';

type MapData = {
  component: any;
  actualData: any;
};

const MapWrapper = ({ actualData, component }: MapData) => {
  const dataArray = extractDataArray(actualData);

  const mapStatsData = dataArray?.find(
    (d: any) => d.name === component?.dataMap,
  );

  if (mapStatsData) return <DashboardMap coordinates={mapStatsData?.data} />;
};

export default MapWrapper;
