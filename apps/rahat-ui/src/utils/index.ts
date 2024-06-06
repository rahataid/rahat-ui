export function truncateEthereumAddress(address: string) {
  if (address.length <= 42) {
    return address;
  }

  const prefixLength = 4; // Keep the first 4 characters
  const suffixLength = 4; // Keep the last 4 characters

  // Extract the prefix and suffix
  const prefix = address.substring(0, prefixLength);
  const suffix = address.substring(address.length - suffixLength);

  // Create the truncated address with ellipsis in between
  const truncatedAddress = `${prefix}....${suffix}`;
  return truncatedAddress;
}

export function formatDate(date: number) {
  const formattedDate = new Date(date * 1000)?.toLocaleDateString('en-GB');
  return formattedDate;
}

export function formatdbDate(date: string) {
  const updated = new Date(date).toLocaleDateString();
  return updated;
}

export const humanizeString = (inputString: string) => {
  // Replace underscore with space
  inputString = inputString?.replace(/_/g, ' ');

  let words = inputString?.toLowerCase().split(' ');
  // Capitalize the first letter of each word
  for (let i = 0; i < words?.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  const result = words?.join(' ');
  return truncateString(result, 50);
};

function truncateString(inputStr: string, length: number) {
  if (!length) length = 10;
  if (inputStr?.length > length) {
    return inputStr?.slice(0, length) + '...';
  }
  return inputStr;
}
