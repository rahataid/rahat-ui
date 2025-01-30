// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.


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