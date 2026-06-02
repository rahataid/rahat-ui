type FieldSchemaInput = {
  name: string;
  fieldType:
    | 'TEXT'
    | 'NUMBER'
    | 'DATE'
    | 'DATETIME'
    | 'BOOLEAN'
    | 'DROPDOWN'
    | string;
  isActive: boolean;
  fieldPopulate?: string[] | null;
  variations?: string[];
};

export function generateJsonSchemaFromFields(
  response: FieldSchemaInput[] | undefined,
  options?: {
    title?: string;
    description?: string;
    version?: string;
    id?: string;
  },
) {
  const properties: Record<string, Record<string, unknown>> = {};
  const required: string[] = [];

  response?.forEach((field: FieldSchemaInput) => {
    const name = field.name;
    const isRequired = field.isActive;

    // Base type mapping
    const typeMap: Record<string, string> = {
      TEXT: 'string',
      NUMBER: 'number',
      DATE: 'string',
      DATETIME: 'string',
      BOOLEAN: 'boolean',
      DROPDOWN: 'string',
    };

    const baseType = typeMap[field.fieldType] || 'string';

    // Build property schema
    const propertySchema: Record<string, unknown> = {};

    // Special handling for 'id' field - always integer
    if (name === 'id') {
      propertySchema.type = 'integer';
      propertySchema.description = 'Auto-incremented database ID';
    } else {
      // Handle nullable types - if not required, make it nullable
      if (isRequired) {
        propertySchema.type = baseType;
      } else {
        propertySchema.type = [baseType, 'null'];
      }

      // Add format based on field type or name
      if (field.fieldType === 'DATE') {
        propertySchema.format = 'date';
      } else if (field.fieldType === 'DATETIME') {
        propertySchema.format = 'date-time';
      } else if (name === 'email') {
        propertySchema.format = 'email';
      } else if (
        name === 'uuid' ||
        name.toLowerCase().includes('uuid') ||
        name.endsWith('By')
      ) {
        propertySchema.format = 'uuid';
      }

      // Add pattern for phone numbers
      if (name === 'phone' || name.toLowerCase().includes('phone')) {
        propertySchema.pattern = '^\\+?[1-9]\\d{1,14}$';
      }

      // Add enum values for known status fields
      if (name === 'gender') {
        propertySchema.enum = ['MALE', 'FEMALE', 'OTHER', 'UNKNOWN'];
      } else if (name === 'bankedStatus') {
        propertySchema.enum = ['BANKED', 'UNBANKED', 'UNKNOWN'];
        propertySchema.default = 'UNKNOWN';
      } else if (name === 'internetStatus') {
        propertySchema.enum = ['CONNECTED', 'DISCONNECTED', 'UNKNOWN'];
        propertySchema.default = 'UNKNOWN';
      } else if (name === 'phoneStatus') {
        propertySchema.enum = [
          'NO_PHONE',
          'FEATURE_PHONE',
          'SMART_PHONE',
          'UNKNOWN',
        ];
        propertySchema.default = 'UNKNOWN';
      } else if (field.fieldType === 'DROPDOWN' && field.fieldPopulate) {
        // If dropdown has fieldPopulate data, use it for enum
        propertySchema.enum = field.fieldPopulate;
      }

      // Add description
      if (field.variations && field.variations.length > 0) {
        propertySchema.description = field.variations.join(', ');
      } else {
        // Generate a human-readable description from the field name
        const readableName = name
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str: string) => str.toUpperCase())
          .trim()
          .toLowerCase();
        propertySchema.description = `${
          readableName.charAt(0).toUpperCase() + readableName.slice(1)
        } of the beneficiary`;
      }
    }

    properties[name] = propertySchema;

    // Add to required array if active
    if (isRequired) {
      required.push(name);
    }
  });

  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id:
      options?.id ||
      'https://community-tool.org/schemas/beneficiary-data-standard/v1.0',
    title: options?.title || 'Beneficiary Data Standard',
    description:
      options?.description ||
      'Schema defining standardized structure for beneficiary data within community systems.',
    version: options?.version || '1.0.0',
    type: 'object',
    required,
    properties,
  };
}
