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
export const truncateAddress = (address?: string | null): string => {
  if (typeof address !== 'string' || address.length <= 8) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export function trimDecimalZeros(value: string | number): string {
  return parseFloat(value?.toString())?.toString();
}

export function formatEnumString(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
