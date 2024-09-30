import React from 'react';
import { Landmark, Home } from 'lucide-react';

export default function MapIndicators() {
  return (
    <div className="absolute top-2 right-2 bg-white p-4 rounded shadow-lg z-10 text-xs">
      <div className="flex space-x-2 mb-1">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div>Below 50m</div>
      </div>
      <div className="flex space-x-2 mb-1">
        <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
        <div> 50m-200m </div>
      </div>
      <div className="flex space-x-2 mb-1">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <div> Above 200m </div>
      </div>
      <div className="flex space-x-2 mb-1">
        <div>
          <Home size={13} color="#FFC300" />
        </div>
        <div> Evacuation Center </div>
      </div>
      <div className="flex space-x-2 mb-1">
        <div>
          <Landmark size={13} color="#0C609B" />
        </div>
        <div> Bank </div>
      </div>
    </div>
  );
}
