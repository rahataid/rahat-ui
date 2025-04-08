import { Heading } from 'apps/rahat-ui/src/common';
import { Info, WaterLevelView } from './components';
import RiverWatchMap from './components/dhm/river.watch.map';

export default function RiverWatchDetails() {
  return (
    <div className="p-4">
      <Heading
        title="River Watch"
        description="Detailed view of the selected station"
      />
      <div className="flex flex-col gap-4">
        <Info />
        <WaterLevelView />
        <RiverWatchMap
          coordinates={[{ latitude: 28.8526, longitude: 80.4344 }]}
        />
      </div>
    </div>
  );
}
