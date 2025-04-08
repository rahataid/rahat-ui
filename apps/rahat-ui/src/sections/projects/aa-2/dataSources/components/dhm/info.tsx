import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Heading } from 'apps/rahat-ui/src/common';
import { Globe, MapPin, RadioTower, TrendingUp } from 'lucide-react';

export function Info() {
  const cardData = [
    {
      icon: RadioTower,
      label: 'Station Index',
      value: '281.5',
    },
    {
      icon: Globe,
      label: 'Latitude',
      value: '29.0 N',
    },
    {
      icon: Globe,
      label: 'Longitude',
      value: '80.0 E',
    },
    {
      icon: TrendingUp,
      label: 'Elevation',
      value: '800.0 m',
    },
    {
      icon: MapPin,
      label: 'District',
      value: 'Darchula',
    },
  ];
  return (
    <div className="flex justify-between space-x-4">
      <div className="p-4 rounded-sm border shadow w-full">
        <div className="flex justify-between gap-4">
          <Heading
            title="Doda (Machheli) River at East West Highway"
            titleStyle="text-xl/6 font-semibold"
            description="Doda (Machheli) River at East West Highway"
          />
          <div>
            <Badge>Steady</Badge>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {cardData?.map((d) => {
            const Icon = d.icon;
            return (
              <div className="flex space-x-3 items-center">
                <div>
                  <Icon className="text-gray-500" size={20} />
                </div>
                <div>
                  <p className="text-sm/6 font-medium mb-1">{d.label}</p>
                  <p className="text-sm/4 text-gray-600">{d.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-4 rounded-sm border shadow text-center w-64">
        <p className="text-primary font-semibold text-3xl/10">1.955m</p>
        <p className="text-sm/6 font-medium">Water Level</p>
        <p className="text-gray-500 text-sm/6">{new Date().toLocaleString()}</p>
        <Badge>Below Warning Level</Badge>
      </div>
    </div>
  );
}
