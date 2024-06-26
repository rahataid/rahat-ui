

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

export const projectUUID = "87e30795-d3c7-4d2a-a40a-7c9164f8d471";