'use client';

import { RegionType } from '../utils/districts';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';

interface RegionSelectorProps {
  selectedRegion: RegionType;
  onRegionChange: (region: RegionType) => void;
}

export function RegionSelector({
  selectedRegion,
  onRegionChange,
}: RegionSelectorProps) {
  const regions: { value: RegionType; label: string }[] = [
    { value: 'province', label: 'Province' },
    { value: 'district', label: 'District' },
    { value: 'municipality', label: 'Municipality' },
  ];

  return (
    <Card className="p-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 w-80">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Region Type
      </label>
      <select
        value={selectedRegion}
        onChange={(e) => onRegionChange(e.target.value as RegionType)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        {regions.map((region) => (
          <option key={region.value} value={region.value}>
            {region.label}
          </option>
        ))}
      </select>
    </Card>
  );
}
