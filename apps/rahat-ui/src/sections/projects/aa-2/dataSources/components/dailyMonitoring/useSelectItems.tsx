import { useTranslations } from 'next-intl';

export const useSelectItems = () => {
  const t = useTranslations('AA Project');
  const riverBasins = [
    { value: 'Karnali', label: 'Karnali' },
    { value: 'Mahakali', label: 'Mahakali' },
    { value: 'Bheri', label: 'Bheri' },
    { value: 'Doda river at East-West Highway', label: 'Dodha' },
  ];

  const dataSourceSelectItems = [
    { value: 'DHM', label: t('DHM') },
    { value: 'GLOFAS', label: 'GLOFAS' },
    {
      value: 'Flash Flood Risk Monitoring',
      label: t('FLASH_FLOOD_RISK_MONITORING'),
    },
    { value: 'NCMRWF Accumulated', label: t('NCMRWF_ACCUMULATED') },
    {
      value: 'NCMRWF Deterministic & Probabilistic',
      label: t('NCMRWF_DETERMINISTIC_PROBABILISTIC'),
    },
    { label: t('GAUGE_READING'), value: 'Gauge Reading' },
  ];

  const dhmForecastSelectItems = [
    {
      value: '3 Days Flood Forecast Bulletin',
      label: t('N3_DAYS_FLOOD_FORECAST_BULLETIN'),
    },
    {
      value: '3 Days Rainfall Forecast Bulletin',
      label: t('N3_DAYS_RAINFALL_FORECAST_BULLETIN'),
    },
    {
      value: 'Realtime Monitoring (River Watch)',
      label: t('REALTIME_MONITORING_RIVER_WATCH'),
    },

    { value: 'NWP', label: 'NWP' },
  ];

  const flashFloodRiskSelectItems = [
    { value: 'Low Risk', label: t('LOW_RISK') },
    { value: 'Medium Risk', label: t('MEDIUM_RISK') },
    { value: 'High Risk', label: t('HIGH_RISK') },
    { value: 'Extreme High Risk', label: t('EXTREME_HIGH_RISK') },
  ];

  const rainfallSelectItems = [
    { value: '0-10MM', label: '0-10MM' },
    { value: '10-50MM', label: '10-50MM' },
    { value: '50-100MM', label: '50-100MM' },
    { value: '100-200MM', label: '100-200MM' },
    { value: '>200MM', label: '>200MM' },
  ];

  const floodForecastSelectItems = [
    { value: 'Steady', label: t('STEADY') },
    { value: 'Minor Fluctuations', label: t('MINOR_FLUCTUATIONS') },
    { value: 'Increase', label: t('INCREASE') },
    { value: 'Decrease', label: t('DECREASE') },
    { value: 'Minor Increase', label: t('MINOR_INCREASE') },
  ];

  const rainfallForecastSelectItems = [
    { value: 'No Rain', label: t('NO_RAIN') },
    { value: 'Light Rain', label: t('LIGHT_RAIN') },
    { value: 'Moderate Rain', label: t('MODERATE_RAIN') },
    { value: 'Heavy Rain', label: t('HEAVY_RAIN') },
    { value: 'Very Heavy Rain', label: t('VERY_HEAVY_RAIN') },
    { value: 'Extremely Heavy Rain', label: t('EXTREMELY_HEAVY_RAIN') },
  ];

  const gaugeReadingRainfallStationItems = [
    { value: 'Rangoon Ridge', label: 'Rangoon Ridge' },
    { value: 'Kolmoda Satyas ', label: 'Kolmoda Satyas ' },
  ];

  const gaugeReadingRiverStationItems = [
    { value: 'Macheli Mahendra Highway', label: 'Macheli Mahendra Highway' },
    { value: 'Kolmoda', label: 'Kolmoda' },
  ];

  const possibility = [
    { value: 'Yes', label: t('YES') },
    { value: 'No', label: t('NO') },
  ];

  const gaugeForecastDataSourceSelectItems = [
    { value: 'rainfallWatch', label: t('RAINFALL_WATCH') },
    { value: 'riverWatch', label: t('RIVER_WATCH') },
  ];

  return {
    riverBasins,
    dataSourceSelectItems,
    dhmForecastSelectItems,
    flashFloodRiskSelectItems,
    rainfallSelectItems,
    floodForecastSelectItems,
    rainfallForecastSelectItems,
    gaugeReadingRainfallStationItems,
    gaugeReadingRiverStationItems,
    possibility,
    gaugeForecastDataSourceSelectItems,
  };
};
