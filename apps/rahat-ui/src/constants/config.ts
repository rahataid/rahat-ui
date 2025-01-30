// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
export const mapboxBasicConfig = {
  mapboxAccessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
  minZoom: 1,
};

export const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE || false;
