import { z } from 'zod';
import { normalizeNumeralsToNumberPreprocessor } from 'apps/rahat-ui/src/utils/numeral.utils';

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
  // for heatwave
  prob_humidity: {
    label: 'DHM Humidity',
    sourceSubType: 'Humidity Probability (%)',
    subTypes: ['hourly', 'daily'],
  },
  temperature_c: {
    label: 'DHM Temperature',
    sourceSubType: 'Temperature (°C)',
    subTypes: ['hourly', 'daily'],
  },
} as const;

const sourceValues = Object.keys(SOURCE_CONFIG) as [
  keyof typeof SOURCE_CONFIG,
  ...Array<keyof typeof SOURCE_CONFIG>,
];

const operatorValues = ['>', '<', '=', '>=', '<='] as const;

const fieldLabels: Record<keyof typeof SOURCE_CONFIG, string> = {
  water_level_m: 'LEVEL_TYPE',
  discharge_m3s: 'DISCHARGE_TYPE',
  rainfall_mm: 'MEASUREMENT_PERIOD',
  prob_flood: 'PROBABILITY_PERIOD',
  // for heatwave
  prob_humidity: 'HUMIDITY_PERIOD',
  temperature_c: 'TEMPERATURE_PERIOD',
};

const emptyStringToUndefined = (val: unknown) => (val === '' ? undefined : val);

const sourceSchema = z.union([z.enum(sourceValues), z.literal('')]).optional();

const operatorSchema = z
  .union([z.enum(operatorValues), z.literal('')])
  .optional();

const valueSchema = z
  .preprocess(
    normalizeNumeralsToNumberPreprocessor,
    z.union([z.coerce.number().finite(), z.literal('')]),
  )
  .optional();

type Translator = (key: string, values?: Record<string, any>) => string;

export const buildTriggerStatementSchemaBase = (t: Translator) =>
  z
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
      let message = t('SOURCE_SUBTYPE_IS_REQUIRED');

      switch (data.source) {
        case 'water_level_m':
          message = t('LEVEL_TYPE_IS_REQUIRED');
          break;
        case 'discharge_m3s':
          message = t('DISCHARGE_TYPE_IS_REQUIRED');
          break;
        case 'rainfall_mm':
          message = t('MEASUREMENT_PERIOD_IS_REQUIRED');
          break;
        case 'prob_flood':
          message = t('PROBABILITY_PERIOD_IS_REQUIRED');
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
        message: t('OPERATOR_IS_REQUIRED'),
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
        message: t('VALUE_IS_REQUIRED'),
        code: z.ZodIssueCode.custom,
      });
    }

    if (typeof data.value === 'number' && !isNaN(data.value)) {
      if (data.value <= 0) {
        ctx.addIssue({
          path: ['value'],
          message: t('VALUE_MUST_BE_A_POSITIVE_NUMBER'),
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.source === 'prob_flood' && data.value > 100) {
        ctx.addIssue({
          path: ['value'],
          message: t('VALUE_CANNOT_EXCEED_100_FLOOD_PROBABILITY'),
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
        message: t('EXPRESSION_MUST_CONTAIN_OPERATOR_AND_VALUE'),
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.source !== 'prob_flood') {
      if (!data.stationId) {
        ctx.addIssue({
          path: ['stationId'],
          message: t('STATION_IS_REQUIRED'),
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.stationName) {
        ctx.addIssue({
          path: ['stationName'],
          message: t('STATION_IS_REQUIRED'),
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export const buildTriggerStatementSchema = (t: Translator) =>
  buildTriggerStatementSchemaBase(t).superRefine(
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
        message: t('MUST_BE_ONE_OF', {
          field: t(fieldLabels[value.source]),
          options: config.subTypes.join(', '),
        }),
        path: ['sourceSubType'],
      });
    }

    if (value.operator && !value.expression?.includes(value.operator)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('EXPRESSION_MUST_INCLUDE_SELECTED_OPERATOR'),
        path: ['expression'],
      });
    }

    if (
      value.sourceSubType &&
      !value.expression?.includes(value.sourceSubType)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('EXPRESSION_MUST_REFERENCE_SELECTED_SOURCE_SUBTYPE'),
        path: ['expression'],
      });
    }
  },
);
