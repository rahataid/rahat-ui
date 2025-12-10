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
    subTypes: ['2_years_max_prob', '5_years_max_prob', '20_years_max_prob'],
  },
} as const;

const sourceValues = Object.keys(SOURCE_CONFIG) as [
  keyof typeof SOURCE_CONFIG,
  ...Array<keyof typeof SOURCE_CONFIG>,
];

const operatorValues = ['>', '<', '=', '>=', '<='] as const;

const numericValueSchema = z.coerce.number().finite();

export const triggerStatementSchemaBase = z.object({
  source: z.enum(sourceValues),
  sourceSubType: z.string().min(1, 'sourceSubType is required'),
  seriesId: z.string().optional(),
  operator: z.enum(operatorValues),
  value: numericValueSchema,
  expression: z
    .string()
    .trim()
    .min(3, 'expression must contain an operator and value'),
});

export const triggerStatementSchema = triggerStatementSchemaBase.superRefine(
  (value, ctx) => {
    const config = SOURCE_CONFIG[value.source];
    if (
      config &&
      !(config.subTypes as readonly string[]).includes(value.sourceSubType)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `sourceSubType must be one of [${config.subTypes.join(
          ', ',
        )}] for ${value.source}`,
        path: ['sourceSubType'],
      });
    }

    if (!value.expression.includes(value.operator)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'expression must include the selected operator',
        path: ['expression'],
      });
    }

    if (!value.expression.includes(value.sourceSubType)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'expression must reference the selected sourceSubType',
        path: ['expression'],
      });
    }
  },
);
