export interface WeatherLayer {
  id: string;
  name: string;
  nameKey?: string;
  layer: string;
  description: string;
  descriptionKey?: string;
  icon: string;
  category: string;
}

export interface WMSForecastGroup {
  name: string;
  workspace: string;
  layers: string[];
  datetime: string;
}

export type WMSForecastResponse = WMSForecastGroup[];

export interface GroupedLayers {
  [category: string]: WeatherLayer[];
}

// Map model names to display categories
const categoryMap: Record<string, string> = {
  gidc_wrf: 'DHM-WRF',
  gidc_wrfda: 'DHM-WRFDA',
  mfd_uems: 'WRF-EMS',
  gfs: 'GFS',
};

export const WMS_CONFIG = {
  baseUrl: 'https://dhm.gov.np/mfd/geoserver/wms/NWP',
  apiUrl: 'https://dhm.gov.np/mfd/api/wms-forecast',
  version: '1.1.1',
  format: 'image/png',
  transparent: true,
  attribution: '© DHM Nepal - Department of Hydrology and Meteorology',
} as const;

// Map layer names to user-friendly display info
const layerDisplayInfo: Record<
  string,
  { name: string; nameKey: string; description: string; descriptionKey: string; icon: string }
> = {
  'NWP:gidc_wrf_air_temperature': {
    name: 'Air Temperature',
    nameKey: 'AIR_TEMPERATURE',
    description: 'Surface air temperature forecast',
    descriptionKey: 'SURFACE_AIR_TEMPERATURE_FORECAST',
    icon: 'thermometer',
  },
  'NWP:gidc_wrf_hourly_precipitation': {
    name: 'Hourly Precipitation',
    nameKey: 'HOURLY_PRECIPITATION',
    description: 'Hourly precipitation forecast',
    descriptionKey: 'HOURLY_PRECIPITATION_FORECAST',
    icon: 'cloud-rain',
  },
  'NWP:gidc_wrf_accumulated_precipitation': {
    name: 'Accumulated Precipitation',
    nameKey: 'ACCUMULATED_PRECIPITATION',
    description: 'Total accumulated precipitation',
    descriptionKey: 'TOTAL_ACCUMULATED_PRECIPITATION',
    icon: 'cloud-rain',
  },
  'NWP:gidc_wrf_wind_speed_coverage': {
    name: 'Wind Speed',
    nameKey: 'WIND_SPEED',
    description: 'Wind speed coverage forecast',
    descriptionKey: 'WIND_SPEED_COVERAGE_FORECAST',
    icon: 'wind',
  },
  'NWP:gidc_wrf_wind_gust_coverage': {
    name: 'Wind Gust',
    nameKey: 'WIND_GUST',
    description: 'Wind gust coverage forecast',
    descriptionKey: 'WIND_GUST_COVERAGE_FORECAST',
    icon: 'wind',
  },
  'NWP:gidc_wrfda_air_temperature': {
    name: 'Air Temperature',
    nameKey: 'AIR_TEMPERATURE',
    description: 'Data assimilation air temperature forecast',
    descriptionKey: 'DATA_ASSIMILATION_AIR_TEMPERATURE_FORECAST',
    icon: 'thermometer',
  },
  'NWP:gidc_wrfda_hourly_precipitation': {
    name: 'Hourly Precipitation',
    nameKey: 'HOURLY_PRECIPITATION',
    description: 'Data assimilation hourly precipitation',
    descriptionKey: 'DATA_ASSIMILATION_HOURLY_PRECIPITATION',
    icon: 'cloud-rain',
  },
  'NWP:gidc_wrfda_accumulated_precipitation': {
    name: 'Accumulated Precipitation',
    nameKey: 'ACCUMULATED_PRECIPITATION',
    description: 'Data assimilation total precipitation',
    descriptionKey: 'DATA_ASSIMILATION_TOTAL_PRECIPITATION',
    icon: 'cloud-rain',
  },
  'NWP:gidc_wrfda_wind_speed_coverage': {
    name: 'Wind Speed',
    nameKey: 'WIND_SPEED',
    description: 'Data assimilation wind speed',
    descriptionKey: 'DATA_ASSIMILATION_WIND_SPEED',
    icon: 'wind',
  },
  'NWP:gidc_wrfda_wind_gust_coverage': {
    name: 'Wind Gust',
    nameKey: 'WIND_GUST',
    description: 'Data assimilation wind gust',
    descriptionKey: 'DATA_ASSIMILATION_WIND_GUST',
    icon: 'wind',
  },
  'NWP:gidc_wrfda_relative_humidity': {
    name: 'Relative Humidity',
    nameKey: 'RELATIVE_HUMIDITY',
    description: 'Data assimilation relative humidity',
    descriptionKey: 'DATA_ASSIMILATION_RELATIVE_HUMIDITY',
    icon: 'droplets',
  },
  'NWP:gidc_wrfda_total_cloud': {
    name: 'Total Cloud Cover',
    nameKey: 'TOTAL_CLOUD_COVER',
    description: 'Data assimilation cloud coverage',
    descriptionKey: 'DATA_ASSIMILATION_CLOUD_COVERAGE',
    icon: 'cloud-rain',
  },
};

// Normalized weather-variable name -> translation key, used for layers not
// explicitly listed above (e.g. GFS), matched after stripping the model prefix.
const VARIABLE_NAME_KEY_MAP: Record<string, string> = {
  'air temperature': 'AIR_TEMPERATURE',
  'hourly precipitation': 'HOURLY_PRECIPITATION',
  'accumulated precipitation': 'ACCUMULATED_PRECIPITATION',
  'wind speed': 'WIND_SPEED',
  'wind speed coverage': 'WIND_SPEED',
  'wind gust': 'WIND_GUST',
  'wind gust coverage': 'WIND_GUST',
  'relative humidity': 'RELATIVE_HUMIDITY',
  'total cloud cover': 'TOTAL_CLOUD_COVER',
  'total cloud': 'TOTAL_CLOUD_COVER',
};

// Known model prefixes to strip so the same weather variable (e.g. "air
// temperature") resolves to the same translation key regardless of model.
const MODEL_PREFIXES = ['gidc_wrfda_', 'gidc_wrf_', 'mfd_uems_', 'gfs_'];

function getIconForBaseName(base: string): string {
  const lower = base.toLowerCase();

  switch (true) {
    case lower.includes('temperature'):
      return 'thermometer';
    case lower.includes('precipitation') || lower.includes('rain'):
      return 'cloud-rain';
    case lower.includes('wind'):
      return 'wind';
    case lower.includes('humidity'):
      return 'droplets';
    case lower.includes('cloud'):
      return 'cloud-rain';
    default:
      return 'layers';
  }
}

function getFallbackDisplayInfo(layerName: string): {
  name: string;
  nameKey?: string;
  description: string;
  icon: string;
} {
  const afterNamespace = layerName.split(':')[1] || layerName;
  const base = afterNamespace;

  const strippedPrefix = MODEL_PREFIXES.find((prefix) =>
    base.toLowerCase().startsWith(prefix),
  );
  const variableBase = strippedPrefix
    ? base.slice(strippedPrefix.length)
    : base;

  const readable = base.replace(/_/g, ' ');
  const capitalized = readable.replace(/\b\w/g, (c) => c.toUpperCase());

  const variableReadable = variableBase.replace(/_/g, ' ').toLowerCase();
  const nameKey = VARIABLE_NAME_KEY_MAP[variableReadable];

  const icon = getIconForBaseName(base);

  return {
    name: capitalized || afterNamespace,
    nameKey,
    description: 'Weather forecast layer',
    icon,
  };
}

export async function fetchWeatherLayers(): Promise<{
  groupedLayers: GroupedLayers;
  availableTimes: Date[];
}> {
  try {
    const response = await fetch(WMS_CONFIG.apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch weather layers: ${response.status} ${response.statusText}`,
      );
    }

    const data: WMSForecastResponse = await response.json();

    // Validate data structure - API returns an array of forecast groups
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(
        'Invalid API response structure: expected array of forecast groups',
      );
    }

    // Group layers by category
    const groupedLayers: GroupedLayers = {};
    const allTimes: Date[] = [];

    for (const group of data) {
      if (!group.layers || !Array.isArray(group.layers)) {
        continue;
      }

      const category = categoryMap[group.name] || group.name.toUpperCase();
      groupedLayers[category] = [];

      // Convert layers to WeatherLayer format
      for (const layerName of group.layers) {
        const displayInfo =
          layerDisplayInfo[layerName] || getFallbackDisplayInfo(layerName);

        const id = layerName.split(':')[1] || layerName;

        groupedLayers[category].push({
          id,
          name: displayInfo.name,
          nameKey: displayInfo.nameKey,
          layer: layerName,
          description: displayInfo.description,
          descriptionKey: (displayInfo as { descriptionKey?: string }).descriptionKey,
          icon: displayInfo.icon,
          category,
        });
      }

      // Parse available times from this group
      if (group.datetime) {
        const times = group.datetime
          .split(',')
          .map((timeStr) => new Date(timeStr.trim()))
          .filter((date) => !isNaN(date.getTime()));

        allTimes.push(...times);
      }
    }

    // Remove duplicate times and sort them
    const uniqueTimes = Array.from(new Set(allTimes.map((t) => t.getTime())))
      .map((timestamp) => new Date(timestamp))
      .sort((a, b) => a.getTime() - b.getTime());

    return { groupedLayers, availableTimes: uniqueTimes };
  } catch (error) {
    console.error('[v0] Error fetching weather layers:', error);

    // Return fallback data with some default times
    const now = new Date();
    const fallbackTimes: Date[] = [];

    // Generate 24 hourly timestamps starting from current hour
    for (let i = 0; i < 24; i++) {
      const time = new Date(now);
      time.setHours(now.getHours() + i, 0, 0, 0);
      fallbackTimes.push(time);
    }

    return {
      groupedLayers: {
        'DHM-WRF': [
          {
            id: 'gidc_wrf_air_temperature',
            name: 'Air Temperature',
            nameKey: 'AIR_TEMPERATURE',
            layer: 'NWP:gidc_wrf_air_temperature',
            description: 'Surface air temperature forecast',
            descriptionKey: 'SURFACE_AIR_TEMPERATURE_FORECAST',
            icon: 'thermometer',
            category: 'DHM-WRF',
          },
          {
            id: 'gidc_wrf_hourly_precipitation',
            name: 'Hourly Precipitation',
            nameKey: 'HOURLY_PRECIPITATION',
            layer: 'NWP:gidc_wrf_hourly_precipitation',
            description: 'Hourly precipitation forecast',
            descriptionKey: 'HOURLY_PRECIPITATION_FORECAST',
            icon: 'cloud-rain',
            category: 'DHM-WRF',
          },
        ],
      },
      availableTimes: fallbackTimes,
    };
  }
}
