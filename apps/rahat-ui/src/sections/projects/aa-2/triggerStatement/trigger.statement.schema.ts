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

const numericValueSchema = z.coerce.number().finite();

export const triggerStatementSchemaBase = z
  .object({
    source: z.enum(sourceValues),
    sourceSubType: z.string().optional(),
    stationId: z.string().optional(),
    stationName: z.string().optional(),
    operator: z.enum(operatorValues).optional(),
    value: numericValueSchema.optional(),
    expression: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
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
        message: 'Operator is required ',
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.sourceSubType && (data.value === undefined || isNaN(data.value))) {
      ctx.addIssue({
        path: ['value'],
        message: 'Value is required ',
        code: z.ZodIssueCode.custom,
      });
    }

    // Validate value is a positive integer
    if (data.value !== undefined && !isNaN(data.value)) {
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

      // For Glofas (prob_flood), value cannot exceed 100
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
        message: 'expression must contain an operator and value',
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
    const config = SOURCE_CONFIG[value.source];
    if (
      config &&
      !(config.subTypes as readonly string[]).includes(
        value.sourceSubType || '',
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `sourceSubType must be one of [${config.subTypes.join(
          ', ',
        )}] for ${value.source}`,
        path: ['sourceSubType'],
      });
    }

    if (!value.expression?.includes(value.operator || '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'expression must include the selected operator',
        path: ['expression'],
      });
    }

    if (
      value.sourceSubType &&
      !value.expression?.includes(value.sourceSubType)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'expression must reference the selected sourceSubType',
        path: ['expression'],
      });
    }
  },
);
