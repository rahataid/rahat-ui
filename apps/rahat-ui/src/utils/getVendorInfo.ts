export const filterVendorsGeoJson = (response: any) => {
  let features: any = [];
  response.data.forEach((ven: any) => {
    if (ven.vendorLocation) {
      features.push({
        type: 'Feature',
        statsCount: ven?.redemptionStats,
        geometry: {
          type: 'Point',
          coordinates: [
            ven.vendorLocation.longitude,
            ven.vendorLocation.latitude,
          ],
        },
      });
    }
  });

  return {
    type: 'FeatureCollection',
    features,
  };
};
