export const includeOnlySelectedTarget = (array: [], selectedTargets: []) => {
  return array.map((item: any) => {
    const extractedFields = {} as any;
    selectedTargets.forEach((key) => {
      if (item.hasOwnProperty(key)) {
        extractedFields[key] = item[key];
      }
    });
    return extractedFields;
  });
};

export const attachedRawData = (payload: any, rawDataSource: []) => {
  let result = [];
  for (let i = 0; i < payload.length; i++) {
    let newItem = { ...payload[i], rawData: rawDataSource[i] };
    result.push(newItem);
  }
  return result;
};

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

export function splitFullName(fullName: string) {
  // Split the full name into an array of words
  let nameArray = fullName.split(' ');

  // Extract the first and last names
  let firstName = nameArray[0];
  let lastName = nameArray[nameArray.length - 1];

  // Create an object to hold the result
  let result = {
    firstName: firstName,
    lastName: lastName,
  };

  return result;
}

export function removeFieldsWithUnderscore(dataArray: []) {
  return dataArray.map((item) => {
    const newObj = {} as any;
    Object.keys(item).forEach((key) => {
      if (!key.startsWith('_')) {
        newObj[key] = item[key];
      }
      if (key === '_id') newObj[key] = item[key];
    });
    return newObj;
  });
}

export const truncatedText = (text: string, maxLen: number) => {
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
};
