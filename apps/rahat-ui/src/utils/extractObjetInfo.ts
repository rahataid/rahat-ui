interface Data {
  [key: string]: any;
}

export function getValueFromPath(data: Data | Data[], path: string): any {
  if (!data || !path) return null;

  const keys = path.split('.');
  let result: any = data;

  for (const key of keys) {
    if (Array.isArray(result)) {
      const index = parseInt(key, 10);
      if (isNaN(index)) {
        // Find object in array with a specific key value
        result = result.find((item) => item.id === key);
      } else if (index >= 0 && index < result.length) {
        result = result[index];
      } else {
        return undefined; // Handle cases where the array index is invalid
      }
    } else if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return undefined; // Handle cases where the path doesn't exist in data
    }
  }

  return result;
}

interface KeyValueObject {
  [key: string]: any;
}

export function mapObjectKeyValue(
  inputObject: KeyValueObject,
  [key, value]: [string, any],
): null | { [key: string]: any }[] {
  const result: { [key: string]: any }[] = [];

  if (!inputObject || !key || !value) {
    return null;
  }

  Object.keys(inputObject).forEach((objKey) => {
    const obj = { [key]: objKey, [value]: inputObject[objKey] };
    result.push(obj);
  });

  return result;
}
