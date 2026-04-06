import { GeoJSON } from 'geojson';

// Cache for region GeoJSON data
const regionCache: Record<string, GeoJSON.FeatureCollection | null> = {
  province: null,
  district: null,
  municipality: null,
};

export type RegionType = 'province' | 'district' | 'municipality';

export interface RegionFeature extends GeoJSON.Feature {
  properties: {
    OBJECTID?: number;
    PROVINCE?: number;
    PR_NAME?: string;
    DISTRICT?: string;
    name?: string;
    REGION_CODE?: string;
    [key: string]: any;
  };
  geometry: GeoJSON.MultiPolygon;
}

export interface DistrictFeature extends GeoJSON.Feature {
  properties: {
    name?: string;
    [key: string]: any;
  };
  geometry: GeoJSON.MultiPolygon;
}

export async function fetchRegionsGeoJSON(
  regionType: RegionType = 'district'
): Promise<GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>> {
  // Return cached data if available
  if (regionCache[regionType]) {
    return regionCache[regionType]!;
  }

  try {
    const response = await fetch(`https://dhm.gov.np/mfd/api/geojson/${regionType}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${regionType}s: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate that we have features
    if (!data.features || !Array.isArray(data.features)) {
      throw new Error(`Invalid GeoJSON format for ${regionType}: missing features array`);
    }

    // Cache the result
    regionCache[regionType] = data;
    
    
    return data;
  } catch (error) {
    console.error(`[v0] Error fetching ${regionType}s:`, error);
    // Return empty feature collection on error
    return { type: 'FeatureCollection', features: [] };
  }
}

// Keep backward compatibility
export async function fetchDistrictsGeoJSON(): Promise<GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>> {
  return fetchRegionsGeoJSON('district');
}

// Get district name by coordinates (for future use)
export function getDistrictAtCoordinates(
  latitude: number,
  longitude: number,
  features: DistrictFeature[]
): string | null {
  for (const feature of features) {
    if (isPointInMultiPolygon(latitude, longitude, feature.geometry.coordinates)) {
      return feature.properties.name;
    }
  }
  return null;
}

// Point-in-polygon detection using ray casting algorithm
function isPointInPolygon(lat: number, lng: number, polygon: number[][][]): boolean {
  for (const ring of polygon) {
    if (pointInRing(lat, lng, ring)) {
      return true;
    }
  }
  return false;
}

function isPointInMultiPolygon(lat: number, lng: number, multiPolygon: number[][][][]): boolean {
  for (const polygon of multiPolygon) {
    if (isPointInPolygon(lat, lng, polygon)) {
      return true;
    }
  }
  return false;
}

function pointInRing(lat: number, lng: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [lon1, lat1] = ring[i];
    const [lon2, lat2] = ring[j];
    
    const intersect = lat1 > lat !== lat2 > lat &&
      lng < ((lon2 - lon1) * (lat - lat1)) / (lat2 - lat1) + lon1;
    
    if (intersect) inside = !inside;
  }
  return inside;
}
