// Flood 2026 survey report tabs (field guide sections A–E). Each chart reads
// one FLOOD26_* stat; the backend only produces a stat when at least one
// household has the field, so a missing stat means "hide this chart" and a
// tab with no stats is hidden too. Titles are keys in the FLOOD_REPORT
// messages namespace.

export type ChartKind =
  'kpi' | 'donut' | 'bar' | 'hbar' | 'stacked' | 'grouped';

export type ReportChart = {
  stat: string;
  title: string;
  kind: ChartKind;
  wide?: boolean;
};

export type ReportTab = {
  value: string;
  configKey: string;
  title: string;
  charts: ReportChart[];
};

export const FLOOD_REPORT_TABS: ReportTab[] = [
  {
    value: 'flood26Demographics',
    configKey: 'flood26Demographics',
    title: 'TAB_HOUSEHOLD_DEMOGRAPHICS',
    charts: [
      {
        stat: 'FLOOD26_HOUSEHOLD_KPIS',
        title: 'POPULATION_COVERED',
        kind: 'kpi',
      },
      {
        stat: 'FLOOD26_CHILDREN_AND_OLDER',
        title: 'CHILDREN_AND_OLDER_PEOPLE',
        kind: 'kpi',
      },
      {
        stat: 'FLOOD26_HOUSEHOLD_SIZE',
        title: 'HOUSEHOLD_SIZE_DISTRIBUTION',
        kind: 'bar',
      },
      {
        stat: 'FLOOD26_POPULATION_BY_GENDER',
        title: 'POPULATION_BY_GENDER',
        kind: 'bar',
      },
      {
        stat: 'FLOOD26_POPULATION_BY_AGE_GENDER',
        title: 'POPULATION_BY_AGE_AND_GENDER',
        kind: 'stacked',
        wide: true,
      },
      {
        stat: 'FLOOD26_HOUSEHOLD_LEADERSHIP',
        title: 'HOUSEHOLD_LEADERSHIP',
        kind: 'donut',
      },
      {
        stat: 'FLOOD26_DISABILITY_AND_ILLNESS',
        title: 'DISABILITY_AND_CHRONIC_ILLNESS',
        kind: 'grouped',
      },
      {
        stat: 'FLOOD26_PREGNANCY_AND_MATERNAL',
        title: 'PREGNANCY_AND_MATERNAL',
        kind: 'grouped',
      },
    ],
  },
  {
    value: 'flood26Livelihood',
    configKey: 'flood26Livelihood',
    title: 'TAB_LIVELIHOOD',
    charts: [
      {
        stat: 'FLOOD26_ANNUAL_INCOME',
        title: 'ANNUAL_INCOME_DISTRIBUTION',
        kind: 'bar',
      },
      {
        stat: 'FLOOD26_INCOME_SOURCES',
        title: 'PRIMARY_LIVELIHOOD',
        kind: 'hbar',
      },
      {
        stat: 'FLOOD26_PRIVATE_LAND',
        title: 'AGRICULTURAL_LAND_HOLDING',
        kind: 'bar',
      },
      {
        stat: 'FLOOD26_CULTIVATED_LAND',
        title: 'LAND_USED_FOR_CULTIVATION',
        kind: 'hbar',
      },
      { stat: 'FLOOD26_LEASED_LAND', title: 'LEASED_LAND', kind: 'donut' },
      {
        stat: 'FLOOD26_LIVELIHOOD_CROP_DAMAGE',
        title: 'LIVELIHOOD_VS_CROP_DAMAGE',
        kind: 'stacked',
      },
      {
        stat: 'FLOOD26_SOCIAL_PROTECTION',
        title: 'SOCIAL_PROTECTION_COVERAGE',
        kind: 'hbar',
      },
      {
        stat: 'FLOOD26_ELIGIBLE_NOT_RECEIVING_SS',
        title: 'ELIGIBLE_NOT_RECEIVING_SOCIAL_SECURITY',
        kind: 'donut',
      },
    ],
  },
  {
    value: 'flood26Housing',
    configKey: 'flood26Housing',
    title: 'TAB_HOUSING',
    charts: [
      { stat: 'FLOOD26_ROOF_TYPE', title: 'ROOF_TYPE', kind: 'hbar' },
      { stat: 'FLOOD26_WALL_TYPE', title: 'WALL_TYPE', kind: 'hbar' },
      { stat: 'FLOOD26_FLOOR_TYPE', title: 'FLOOR_TYPE', kind: 'hbar' },
      {
        stat: 'FLOOD26_FRAME_STRUCTURE',
        title: 'FRAME_STRUCTURE',
        kind: 'bar',
      },
      { stat: 'FLOOD26_FOUNDATION', title: 'FOUNDATION_TYPE', kind: 'hbar' },
      {
        stat: 'FLOOD26_HOUSE_OWNERSHIP',
        title: 'HOUSE_OWNERSHIP',
        kind: 'donut',
      },
      { stat: 'FLOOD26_HOUSE_STOREYS', title: 'HOUSE_STOREYS', kind: 'bar' },
      { stat: 'FLOOD26_FLOOR_HEIGHT', title: 'FLOOR_HEIGHT', kind: 'bar' },
      {
        stat: 'FLOOD26_ROOF_BY_WARD',
        title: 'ROOF_TYPE_BY_WARD',
        kind: 'stacked',
      },
      {
        stat: 'FLOOD26_WALL_BY_WARD',
        title: 'WALL_TYPE_BY_WARD',
        kind: 'stacked',
      },
      {
        stat: 'FLOOD26_FLOOR_BY_WARD',
        title: 'FLOOR_TYPE_BY_WARD',
        kind: 'stacked',
      },
    ],
  },
  {
    value: 'flood26Exposure',
    configKey: 'flood26Exposure',
    title: 'TAB_DISASTER_EXPOSURE',
    charts: [
      {
        stat: 'FLOOD26_HAZARD_EXPOSURE',
        title: 'EXPOSURE_BY_HAZARD',
        kind: 'hbar',
      },
      {
        stat: 'FLOOD26_FLOOD_EXPOSURE_VS_IMPACT',
        title: 'FLOOD_EXPOSURE_VS_IMPACT',
        kind: 'grouped',
      },
      {
        stat: 'FLOOD26_FLOOD_DAMAGE_TYPES',
        title: 'FLOOD_DAMAGE_TYPES',
        kind: 'hbar',
      },
      {
        stat: 'FLOOD26_LIVELIHOOD_CROP_DAMAGE',
        title: 'CROP_DAMAGE_BY_LIVELIHOOD',
        kind: 'stacked',
      },
      {
        stat: 'FLOOD26_HAZARD_BY_WARD',
        title: 'HAZARD_EXPOSURE_BY_WARD',
        kind: 'grouped',
        wide: true,
      },
      {
        stat: 'FLOOD26_DAMAGE_BY_ROOF',
        title: 'DAMAGE_BY_ROOF_TYPE',
        kind: 'grouped',
      },
      {
        stat: 'FLOOD26_DAMAGE_BY_WALL',
        title: 'DAMAGE_BY_WALL_TYPE',
        kind: 'grouped',
      },
      {
        stat: 'FLOOD26_DAMAGE_BY_FLOOR',
        title: 'DAMAGE_BY_FLOOR_TYPE',
        kind: 'grouped',
      },
    ],
  },
  {
    value: 'flood26Preparedness',
    configKey: 'flood26Preparedness',
    title: 'TAB_PREPAREDNESS',
    charts: [
      {
        stat: 'FLOOD26_RECEIVES_WARNING',
        title: 'RECEIVES_WEATHER_WARNING',
        kind: 'donut',
      },
      {
        stat: 'FLOOD26_SAFE_EVACUATION_LOCATION',
        title: 'SAFE_EVACUATION_LOCATION',
        kind: 'donut',
      },
      {
        stat: 'FLOOD26_WARNING_CHANNELS',
        title: 'WARNING_CHANNELS_USED',
        kind: 'hbar',
      },
      {
        stat: 'FLOOD26_EVACUATION_DESTINATION',
        title: 'EVACUATION_DESTINATION',
        kind: 'hbar',
      },
      {
        stat: 'FLOOD26_EVACUATION_THRESHOLD',
        title: 'EVACUATION_THRESHOLD',
        kind: 'hbar',
      },
      {
        stat: 'FLOOD26_RESPONSE_SKILLS',
        title: 'SWIMMING_AND_RESPONSE_TRAINING',
        kind: 'grouped',
      },
      {
        stat: 'FLOOD26_PREPAREDNESS_BY_WARD',
        title: 'PREPAREDNESS_BY_WARD',
        kind: 'grouped',
        wide: true,
      },
    ],
  },
];
