//*** Types ***//
export interface TriggerStatement {
  value: number;
  source: string;
  operator: string;
  expression: string;
  sourceSubType: string;
  stationName?: string;
}
export interface SourceConfig {
  type: string;
  subtypes: string[];
}

export type SourcesRecord = Record<string, SourceConfig>;

export type SourceKey = keyof SourcesRecord;

export type Option = {
  label: string;
  value: string;
};

//*** Helpers ***//
// Convert snake_case → "Snake Case"
export const toLabel = (str: string): string =>
  str?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// Format the main label
export const formatMainLabel = (key: string, type: string) => {
  const rawLabel = `${key.replace(/[:]/, ' ').toUpperCase()} - ${toLabel(
    type,
  )}`;

  return rawLabel
    .replace('Prob Flood', 'Flood Probability (%)')
    .replace('Discharge M3s', 'Discharge (m³/s)')
    .replace('Water Level M', 'Water Level (m)')
    .replace('Rainfall Mm', 'Rainfall (mm)');
};

//*** Builders ***//
// Generate source options
export const buildSourceOptions = (SOURCES: SourcesRecord): Option[] => {
  return Object.entries(SOURCES)?.map(([key, value]) => ({
    label: formatMainLabel(key, value.type),
    value: key,
  }));
};

// Generate subtype options per source
export const buildSubtypeOptions = (
  SOURCES: SourcesRecord,
): Record<string, Option[]> => {
  return Object.fromEntries(
    Object.entries(SOURCES)?.map(([key, value]) => [
      key,
      value?.subtypes?.map((sub) => ({
        label: toLabel(sub),
        value: sub,
      })),
    ]),
  );
};

export const SEP = ' • ';
