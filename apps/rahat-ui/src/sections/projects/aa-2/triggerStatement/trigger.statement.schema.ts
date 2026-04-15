import { z } from 'zod';

export const SOURCE_CONFIG = {
  water_level_m: {
    label: 'DHM Water Level',
    sourceSubType: 'Water Level (m)',
    subTypes: ['warning_level', 'danger_level'],
  },
  discharge_m3s: {
    label: 'GFH',
    sourceSubType: 'Discharge (m³/s)',
    subTypes: ['warning_discharge', 'danger_discharge'],
  },
  rainfall_mm: {
    label: 'DHM Rainfall',
    sourceSubType: 'Rainfall (mm)',
    subTypes: ['hourly', 'daily'],
  },
  prob_flood: {
    label: 'Glofas',
    sourceSubType: 'Flood Probability',
    subTypes: [
      'two_years_return_period',
      'five_years_return_period',
      'twenty_years_return_period',
    ],
  },
} as const;

const sourceValues = Object.keys(SOURCE_CONFIG) as [
  keyof typeof SOURCE_CONFIG,
  ...Array<keyof typeof SOURCE_CONFIG>,
];

const operatorValues = ['>', '<', '=', '>=', '<='] as const;

const fieldLabels: Record<keyof typeof SOURCE_CONFIG, string> = {
  water_level_m: 'Level Type',
  discharge_m3s: 'Discharge Type',
  rainfall_mm: 'Measurement Period',
  prob_flood: 'Probability Period',
};

const emptyStringToUndefined = (val: unknown) => (val === '' ? undefined : val);

const sourceSchema = z.union([z.enum(sourceValues), z.literal('')]).optional();

const operatorSchema = z
  .union([z.enum(operatorValues), z.literal('')])
  .optional();

const valueSchema = z
  .union([z.coerce.number().finite(), z.literal('')])
  .optional();

export const triggerStatementSchemaBase = z
  .object({
    source: sourceSchema,
    sourceSubType: z.string().optional(),
    stationId: z.string().optional(),
    stationName: z.string().optional(),
    operator: operatorSchema,
    value: valueSchema,
    expression: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.source) return;

    if (!data.sourceSubType) {
      let message = 'Source subtype is required';

      switch (data.source) {
        case 'water_level_m':
          message = 'Level type is required';
          break;
        case 'discharge_m3s':
          message = 'Discharge type is required';
          break;
        case 'rainfall_mm':
          message = 'Measurement period is required';
          break;
        case 'prob_flood':
          message = 'Probability period is required';
          break;
      }

      ctx.addIssue({
        path: ['sourceSubType'],
        message,
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.sourceSubType && !data.operator) {
      ctx.addIssue({
        path: ['operator'],
        message: 'Operator is required',
        code: z.ZodIssueCode.custom,
      });
    }

    if (
      data.sourceSubType &&
      (data.value === undefined ||
        data.value === '' ||
        (typeof data.value === 'number' && isNaN(data.value)))
    ) {
      ctx.addIssue({
        path: ['value'],
        message: 'Value is required',
        code: z.ZodIssueCode.custom,
      });
    }

    if (typeof data.value === 'number' && !isNaN(data.value)) {
      if (!Number.isInteger(data.value)) {
        ctx.addIssue({
          path: ['value'],
          message: 'Value must be a positive integer',
          code: z.ZodIssueCode.custom,
        });
      } else if (data.value <= 0) {
        ctx.addIssue({
          path: ['value'],
          message: 'Value must be a positive integer',
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.source === 'prob_flood' && data.value > 100) {
        ctx.addIssue({
          path: ['value'],
          message: 'Value cannot exceed 100 for flood probability',
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (
      data.sourceSubType &&
      (!data.expression || data.expression.trim().length < 3)
    ) {
      ctx.addIssue({
        path: ['expression'],
        message: 'Expression must contain an operator and value',
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.source !== 'prob_flood') {
      if (!data.stationId) {
        ctx.addIssue({
          path: ['stationId'],
          message: 'Station is required',
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.stationName) {
        ctx.addIssue({
          path: ['stationName'],
          message: 'Station is required',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export const triggerStatementSchema = triggerStatementSchemaBase.superRefine(
  (value, ctx) => {
    if (!value.source) return;

    const config = SOURCE_CONFIG[value.source];
    if (
      config &&
      value.sourceSubType &&
      !(config.subTypes as readonly string[]).includes(value.sourceSubType)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${
          fieldLabels[value.source]
        } must be one of [${config.subTypes.join(', ')}]`,
        path: ['sourceSubType'],
      });
    }

    if (value.operator && !value.expression?.includes(value.operator)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Expression must include the selected operator',
        path: ['expression'],
      });
    }

    if (
      value.sourceSubType &&
      !value.expression?.includes(value.sourceSubType)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Expression must reference the selected sourceSubType',
        path: ['expression'],
      });
    }
  },
);
