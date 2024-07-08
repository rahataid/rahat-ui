interface Data {
  [key: string]: any;
}

export function getValueFromPath(data: Data, path: string | null): any {
  const keys = path.split('.');
  let result = data;

  if (!data || !path) return null;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
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
