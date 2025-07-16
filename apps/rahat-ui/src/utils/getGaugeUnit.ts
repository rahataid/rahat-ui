export const getGaugeUnit = (gaugeForecast?: string): string => {
  const gaugeUnitMap: Record<string, string> = {
    riverWatch: 'm',
    rainfallWatch: 'mm',
  };
  return gaugeUnitMap[gaugeForecast || ''] || '';
};
