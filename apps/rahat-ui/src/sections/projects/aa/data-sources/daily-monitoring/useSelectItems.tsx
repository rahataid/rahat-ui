export const useSelectItems = () => {
  const riverBasins = [
    { value: 'Karnali', label: 'Karnali' },
    { value: 'Mahakali', label: 'Mahakali' },
    { value: 'Bheri', label: 'Bheri' },
  ];

  const dataSourceSelectItems = [
    { value: 'DHM', label: 'DHM' },
    { value: 'GLOFAS', label: 'GLOFAS' },
    {
      value: 'Flash Flood Risk Monitoring',
      label: 'Flash Flood Risk Monitoring',
    },
    { value: 'NCMWRF Accumulated', label: 'NCMWRF Accumulated' },
    {
      value: 'NCMWRF Deterministic & Probabilistic',
      label: 'NCMWRF Deterministic & Probabilistic',
    },
  ];

  const dhmForecastSelectItems = [
    {
      value: '3 Days Flood forecast Bulletin',
      label: '3 Days Flood forecast Bulletin',
    },
    {
      value: '3 Days Rainfall forecast Bulletin',
      label: '3 Days Rainfall forecast Bulletin',
    },
    {
      value: 'Real time Monitoring(River Watch)',
      label: 'Real time Monitoring(River Watch)',
    },
    { value: 'NWP', label: 'NWP' },
  ];

  const flashFloodRiskSelectItems = [
    { value: 'Low Risk', label: 'Low Risk' },
    { value: 'Medium Risk', label: 'Medium Risk' },
    { value: 'High Risk', label: 'High Risk' },
    { value: 'Extreme High Risk', label: 'Extreme High Risk' },
  ];

  const rainfallSelectItems = [
    { value: '0-10MM', label: '0-10MM' },
    { value: '10-50MM', label: '10-50MM' },
    { value: '50-100MM', label: '50-100MM' },
    { value: '100-200MM', label: '100-200MM' },
    { value: '>200MM', label: '>200MM' },
  ];

  const floodForecastSelectItems = [
    { value: 'Steady', label: 'Steady' },
    { value: 'Minor Fluctuations', label: 'Minor Fluctuations' },
    { value: 'Increase', label: 'Increase' },
    { value: 'Decrease', label: 'Decrease' },
    { value: 'Minor Increase', label: 'Minor Increase' },
  ];

  const rainfallForecastSelectItems = [
    { value: 'No Rain', label: 'No Rain' },
    { value: 'Light Rain', label: 'Light Rain' },
    { value: 'Moderate Rain', label: 'Moderate Rain' },
    { value: 'Heavy Rain', label: 'Heavy Rain' },
    { value: 'Very Heavy Rain', label: 'Very Heavy Rain' },
    { value: 'Extremely Heavy Rain', label: 'Extremely Heavy Rain' },
  ];

  return {
    riverBasins,
    dataSourceSelectItems,
    dhmForecastSelectItems,
    flashFloodRiskSelectItems,
    rainfallSelectItems,
    floodForecastSelectItems,
    rainfallForecastSelectItems,
  };
};
