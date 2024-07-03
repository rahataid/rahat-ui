

export const filterVendorsGeoJson = (response:any) => {
    
    let features:any = [];
    response.data.forEach((ven:any) => {
      if(ven.vendorLocation){
        features.push({type: 'Feature', geometry: {type: 'Point', coordinates: [ven.vendorLocation.longitude, ven.vendorLocation.latitude]}})
      }
    })

    return {
      type: 'FeatureCollection',
      features
    }
  }

export const projectUUID = process.env.NEXT_PUBLIC_PROJECT_UUID;