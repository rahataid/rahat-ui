import { z } from 'zod';
import {
  normalizeNumeralsPreprocessor,
  normalizeNumeralsToNumberPreprocessor,
} from 'apps/rahat-ui/src/utils/i18n/numeral';

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

// Translation keys for SOURCE_CONFIG's `label`. Reuses the existing GFH/GLOFAS
// acronym keys where the label is just that acronym.
const sourceLabelKeys: Record<keyof typeof SOURCE_CONFIG, string> = {
  water_level_m: 'WATER_LEVEL_M_LABEL',
  discharge_m3s: 'GFH',
  rainfall_mm: 'RAINFALL_MM_LABEL',
  prob_flood: 'GLOFAS',
  prob_humidity: 'PROB_HUMIDITY_LABEL',
  temperature_c: 'TEMPERATURE_C_LABEL',
};

// Translation keys for SOURCE_CONFIG's `sourceSubType`. Each translated value
// must keep the "Name (unit)" shape (unit as the trailing, space-separated,
// parenthesised token) since consumers extract the unit via `/\((.*?)\)/`
// and split off the trailing word to get the name alone.
const sourceSubTypeKeys: Record<keyof typeof SOURCE_CONFIG, string> = {
  water_level_m: 'WATER_LEVEL_M_SUBTYPE',
  discharge_m3s: 'DISCHARGE_M3S_SUBTYPE',
  rainfall_mm: 'RAINFALL_MM_SUBTYPE',
  prob_flood: 'PROB_FLOOD_SUBTYPE',
  prob_humidity: 'PROB_HUMIDITY_SUBTYPE',
  temperature_c: 'TEMPERATURE_C_SUBTYPE',
};

export function getSourceLabel(
  key: string | undefined,
  t: (k: string) => string,
): string | undefined {
  if (!key || !(key in SOURCE_CONFIG)) return undefined;
  return t(sourceLabelKeys[key as keyof typeof SOURCE_CONFIG]);
}

export function getSourceSubTypeLabel(
  key: string | undefined,
  t: (k: string) => string,
): string | undefined {
  if (!key || !(key in SOURCE_CONFIG)) return undefined;
  return t(sourceSubTypeKeys[key as keyof typeof SOURCE_CONFIG]);
}

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

const numeralString = () =>
  z.preprocess(normalizeNumeralsPreprocessor, z.string().optional());

export const buildManualFormSchema = (t: Translator) =>
  z.object({
    title: z.string().min(2, { message: t('PLEASE_ENTER_TRIGGER_TITLE') }),
    isMandatory: z.boolean().optional(),
    description: z.string().optional(),
    leadTime: z.string().optional(),
  });

export const buildEditAutomatedFormSchema = (
  t: Translator,
  phaseName?: string,
) =>
  z
    .object({
      title: z.string().min(2, { message: t('PLEASE_ENTER_TRIGGER_TITLE') }),
      description: z.string().optional(),
      source: z.string().min(1, { message: t('PLEASE_SELECT_DATA_SOURCE') }),
      isMandatory: z.boolean().optional(),
      leadTime: z.string().optional(),
      triggerStatement: buildTriggerStatementSchema(t),
      minLeadTimeDays: numeralString(),
      maxLeadTimeDays: numeralString(),
      probability: numeralString(),
      warningLevel: numeralString(),
      dangerLevel: numeralString(),
      forecast: z.string().optional(),
      daysToConsiderPrior: numeralString(),
      forecastStatus: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.source === 'DHM' && phaseName === 'ACTIVATION') {
        if (!data.dangerLevel || data.dangerLevel.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['dangerLevel'],
            message: t('DANGER_LEVEL_IS_REQUIRED'),
          });
        } else if (
          isNaN(Number(data.dangerLevel)) ||
          Number(data.dangerLevel) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['dangerLevel'],
            message: t('DANGER_LEVEL_POSITIVE_NUMBER'),
          });
        }
      }

      if (data.source === 'DHM' && phaseName === 'READINESS') {
        if (!data.warningLevel || data.warningLevel.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['warningLevel'],
            message: t('WARNING_LEVEL_IS_REQUIRED'),
          });
        } else if (
          isNaN(Number(data.warningLevel)) ||
          Number(data.warningLevel) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['warningLevel'],
            message: t('WARNING_LEVEL_POSITIVE_NUMBER'),
          });
        }
      }

      if (
        data.source === 'DAILY_MONITORING' &&
        (phaseName === 'ACTIVATION' || phaseName === 'READINESS')
      ) {
        if (!data.forecast || data.forecast.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['forecast'],
            message: t('FORECAST_IS_REQUIRED'),
          });
        }

        if (
          !data.daysToConsiderPrior ||
          data.daysToConsiderPrior.trim() === ''
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['daysToConsiderPrior'],
            message: t('DAYS_TO_CONSIDER_PRIOR_IS_REQUIRED'),
          });
        } else if (
          isNaN(Number(data.daysToConsiderPrior)) ||
          Number(data.daysToConsiderPrior) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['daysToConsiderPrior'],
            message: t('DAYS_TO_CONSIDER_PRIOR_POSITIVE_NUMBER'),
          });
        }

        if (!data.forecastStatus || data.forecastStatus.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['forecastStatus'],
            message: t('FORECAST_STATUS_IS_REQUIRED'),
          });
        }
      }

      if (
        data.source === 'GLOFAS' &&
        (phaseName === 'ACTIVATION' || phaseName === 'READINESS')
      ) {
        if (!data.maxLeadTimeDays || data.maxLeadTimeDays.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['maxLeadTimeDays'],
            message: t('MAX_LEAD_TIME_DAYS_IS_REQUIRED'),
          });
        } else if (
          isNaN(Number(data.maxLeadTimeDays)) ||
          Number(data.maxLeadTimeDays) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['maxLeadTimeDays'],
            message: t('MAX_LEAD_TIME_DAYS_POSITIVE_NUMBER'),
          });
        }

        if (!data.minLeadTimeDays || data.minLeadTimeDays.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['minLeadTimeDays'],
            message: t('MIN_LEAD_TIME_DAYS_IS_REQUIRED'),
          });
        } else if (
          isNaN(Number(data.minLeadTimeDays)) ||
          Number(data.minLeadTimeDays) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['minLeadTimeDays'],
            message: t('MIN_LEAD_TIME_DAYS_POSITIVE_NUMBER'),
          });
        }

        if (!data.probability || data.probability.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['probability'],
            message: t('FORECAST_PROBABILITY_IS_REQUIRED'),
          });
        } else if (
          isNaN(Number(data.probability)) ||
          Number(data.probability) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['probability'],
            message: t('FORECAST_PROBABILITY_POSITIVE_NUMBER'),
          });
        }
      }
    });

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
  buildTriggerStatementSchemaBase(t).superRefine((value, ctx) => {
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
  });
