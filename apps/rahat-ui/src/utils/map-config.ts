export const communityMapboxBasicConfig = {
  mapboxAccessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
  minZoom: 1,
};

export const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE || false;
