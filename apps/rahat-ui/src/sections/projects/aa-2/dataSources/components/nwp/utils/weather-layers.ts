export interface WeatherLayer {
  id: string;
  name: string;
  layer: string;
  description: string;
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
  'gidc_wrf': 'DHM-WRF',
  'gidc_wrfda': 'DHM-WRFDA',
  'mfd_uems': 'WRF-EMS',
  'gfs': 'GFS',
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
const layerDisplayInfo: Record<string, { name: string; description: string; icon: string }> = {
  'NWP:gidc_wrf_air_temperature': {
    name: 'Air Temperature (WRF)',
    description: 'Surface air temperature forecast',
    icon: 'thermometer',
  },
  'NWP:gidc_wrf_hourly_precipitation': {
    name: 'Hourly Precipitation (WRF)',
    description: 'Hourly precipitation forecast',
    icon: 'cloud-rain',
  },
  'NWP:gidc_wrf_accumulated_precipitation': {
    name: 'Accumulated Precipitation (WRF)',
    description: 'Total accumulated precipitation',
    icon: 'cloud-rain',
  },
  'NWP:gidc_wrf_wind_speed_coverage': {
    name: 'Wind Speed (WRF)',
    description: 'Wind speed coverage forecast',
    icon: 'wind',
  },
  'NWP:gidc_wrf_wind_gust_coverage': {
    name: 'Wind Gust (WRF)',
    description: 'Wind gust coverage forecast',
    icon: 'wind',
  },
  'NWP:gidc_wrfda_air_temperature': {
    name: 'Air Temperature (WRFDA)',
    description: 'Data assimilation air temperature forecast',
    icon: 'thermometer',
  },
  'NWP:gidc_wrfda_hourly_precipitation': {
    name: 'Hourly Precipitation (WRFDA)',
    description: 'Data assimilation hourly precipitation',
    icon: 'cloud-rain',
  },
  'NWP:gidc_wrfda_accumulated_precipitation': {
    name: 'Accumulated Precipitation (WRFDA)',
    description: 'Data assimilation total precipitation',
    icon: 'cloud-rain',
  },
  'NWP:gidc_wrfda_wind_speed_coverage': {
    name: 'Wind Speed (WRFDA)',
    description: 'Data assimilation wind speed',
    icon: 'wind',
  },
  'NWP:gidc_wrfda_wind_gust_coverage': {
    name: 'Wind Gust (WRFDA)',
    description: 'Data assimilation wind gust',
    icon: 'wind',
  },
  'NWP:gidc_wrfda_relative_humidity': {
    name: 'Relative Humidity (WRFDA)',
    description: 'Data assimilation relative humidity',
    icon: 'droplets',
  },
  'NWP:gidc_wrfda_total_cloud': {
    name: 'Total Cloud Cover (WRFDA)',
    description: 'Data assimilation cloud coverage',
    icon: 'cloud-rain',
  },
};

export async function fetchWeatherLayers(): Promise<{
  groupedLayers: GroupedLayers;
  availableTimes: Date[];
}> {
  try {
    const response = await fetch(WMS_CONFIG.apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch weather layers: ${response.status} ${response.statusText}`);
    }
    
    const data: WMSForecastResponse = await response.json();
    
    // Validate data structure - API returns an array of forecast groups
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid API response structure: expected array of forecast groups');
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
        const displayInfo = layerDisplayInfo[layerName] || {
          name: layerName.split(':')[1]?.replace(/_/g, ' ') || layerName,
          description: 'Weather forecast layer',
          icon: 'layers',
        };
        
        const id = layerName.split(':')[1] || layerName;
        
        groupedLayers[category].push({
          id,
          name: displayInfo.name,
          layer: layerName,
          description: displayInfo.description,
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
            layer: 'NWP:gidc_wrf_air_temperature',
            description: 'Surface air temperature forecast',
            icon: 'thermometer',
            category: 'DHM-WRF',
          },
          {
            id: 'gidc_wrf_hourly_precipitation',
            name: 'Hourly Precipitation',
            layer: 'NWP:gidc_wrf_hourly_precipitation',
            description: 'Hourly precipitation forecast',
            icon: 'cloud-rain',
            category: 'DHM-WRF',
          },
        ],
      },
      availableTimes: fallbackTimes,
    };
  }
}
