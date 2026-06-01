type StandardField = {
  field_name: string;
};

type FieldDefinitionLike = {
  name: string;
};

export function checkStandardJsonMatch(
  standardJson: StandardField[],
  data: FieldDefinitionLike[],
): boolean {
  const standardFieldNames = new Set(
    standardJson.map((field) => field.field_name),
  );
  const dataFieldNames = new Set(data.map((field) => field.name));

  if (standardFieldNames.size !== dataFieldNames.size) {
    return false;
  }

  for (const fieldName of standardFieldNames) {
    if (!dataFieldNames.has(fieldName)) {
      return false;
    }
  }

  return true;
}
