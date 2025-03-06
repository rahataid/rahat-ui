// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
export function formatUnderScoredString(str: string): string {
  // Replace underscores with spaces
  let newStr = str?.replace(/_/g, ' ');

  // Capitalize the first letter of each word and make the rest lowercase
  newStr = newStr?.toLowerCase().replace(/\b[a-z]/g, function (letter) {
    return letter?.toUpperCase();
  });

  return newStr;
}
