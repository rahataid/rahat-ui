import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MAX_EXPORT_COUNT } from '../constants/app.const';

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
  let result = [] as any[];
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
  if (!fullName) return { firstName: '', lastName: '' };
  const names = fullName.trim().split(' ');
  const firstName = names[0];
  const lastName = names.length > 1 ? names.slice(1).join(' ') : '';

  return { firstName, lastName };
}

function removeKeyFromArrayObjects(arr: any, keyToRemove: string) {
  return arr.map((obj: any) => {
    const { [keyToRemove]: deletedKey, ...rest } = obj;
    return rest;
  });
}

export function removeFieldsWithUnderscore(dataArray: []) {
  let splittedData = [] as any;
  splittedData =
    dataArray.length > MAX_EXPORT_COUNT
      ? dataArray.splice(0, MAX_EXPORT_COUNT)
      : dataArray;
  splittedData.map((item: any) => {
    const newObj = {} as any;
    Object.keys(item).forEach((key) => {
      if (!key.startsWith('_')) {
        newObj[key] = item[key];
      }
      if (key === '_id') newObj[key] = item[key];
    });
    return newObj;
  });
  return removeKeyFromArrayObjects(splittedData, 'errorMessage');
}

export const truncatedText = (text: string, maxLen: number) => {
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
};

function moveErrorMsgToFirstKey(data: any) {
  let result = [] as any;
  data.forEach((obj: any) => {
    if ('errorMessage' in obj) {
      const val = obj.errorMessage;
      delete obj.errorMessage;
      obj = { errorMessage: val, ...obj };
    }
    result.push(obj);
  });

  return result;
}

function checkPropertyAndDelete(item: any, propertyName: string) {
  if (item.hasOwnProperty(propertyName)) {
    delete item[propertyName];
  }
  return item;
}

function cleanupNonDuplicateFields(payload: any[]) {
  let data = [];
  for (let p of payload) {
    p = checkPropertyAndDelete(p, 'isDuplicate');
    p = checkPropertyAndDelete(p, 'exportOnly');
    p = checkPropertyAndDelete(p, 'rawData');
    // p = checkPropertyAndDelete(p, 'uuid');
    p = checkPropertyAndDelete(p, 'id');
    p = checkPropertyAndDelete(p, 'customId');
    p = checkPropertyAndDelete(p, 'createdAt');
    p = checkPropertyAndDelete(p, 'updatedAt');
    data.push(p);
  }
  return data;
}

export const splitValidAndDuplicates = (
  payload: any[],
  duplicateData: any[],
) => {
  const sanitized = [] as any;
  const nonDuplicate = payload.filter((d: any) => !d.isDuplicate);
  const duplicates = duplicateData.filter((d: any) => d.isDuplicate);
  for (let p of duplicates) {
    p = checkPropertyAndDelete(p, 'isDuplicate');
    p = checkPropertyAndDelete(p, 'exportOnly');
    p = checkPropertyAndDelete(p, 'rawData');
    // p = checkPropertyAndDelete(p, 'uuid');
    p = checkPropertyAndDelete(p, 'id');
    p = checkPropertyAndDelete(p, 'customId');
    p = checkPropertyAndDelete(p, 'createdAt');
    p = checkPropertyAndDelete(p, 'updatedAt');
    p.errorMessage = 'Duplicate data';
    sanitized.push(p);
  }
  const swapped = moveErrorMsgToFirstKey(sanitized);
  const validData = cleanupNonDuplicateFields(nonDuplicate);
  return { validData, sanitized: swapped };
};

function createInvalidFieldError(errFields: any, isDuplicate: boolean) {
  const errFieldsArr = errFields.map((err: any) => err.fieldName);
  return `Invalid fields: ${errFieldsArr.join(', ')} ${
    isDuplicate ? 'and This row is duplicate!' : ''
  }`;
}

// Export both error and duplicate data to excel
export const splitValidAndInvalid = (payload: any[], errors: []) => {
  const invalidData = [] as any;
  const validData = [] as any;
  payload.forEach((p: any) => {
    const error = errors.find((error: any) => error.uuid === p.uuid);
    if (error || p.isDuplicate) {
      const errFields = errors.filter((err: any) => err.uuid === p.uuid);
      if (p.uuid) delete p.uuid;
      if (p.rawData) delete p.rawData;
      if (errFields.length) {
        p.errorMessage = createInvalidFieldError(
          errFields,
          p.isDuplicate || false,
        );
      } else p.errorMessage = 'This row is duplicate!';
      invalidData.push(p);
    } else {
      validData.push(p);
    }
  });



  const swapped = moveErrorMsgToFirstKey(invalidData);
  return { invalidData: swapped, validData };
};

export const exportDataToExcel = (data: []) => {
  const currentDate = new Date().getTime();
  const fileName = `Invalid_Beneficiary_${currentDate}.xlsx`;
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Buffer to store the generated Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  });

  saveAs(blob, fileName);
};

export const formatNameString = (inputString: string) => {
  // Replace spaces with underscores
  let stringWithUnderscores = inputString.replace(/ /g, '_');
  // Replace '.' with underscore
  let stringWithUnderscoresAndDots = stringWithUnderscores.replace(/\./g, '_');
  // Remove special characters using regex
  let stringWithoutSpecialChars = stringWithUnderscoresAndDots.replace(
    /[^\w\s]/gi,
    '',
  );
  return stringWithoutSpecialChars;
};

export const isURL = (value: string) => {
  let urlPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
  return urlPattern.test(value);
};

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

export function formatDate(date: Date) {
  const changedDate = new Date(date);
  const year = changedDate.getFullYear();
  const month = (changedDate.getMonth() + 1).toString().padStart(2, '0');
  const day = changedDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export const selectNonEmptyFields = (data: any) => {
  const nonEmptyFields: any = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      nonEmptyFields[key] = value;
    }
  });
  return nonEmptyFields;
};
