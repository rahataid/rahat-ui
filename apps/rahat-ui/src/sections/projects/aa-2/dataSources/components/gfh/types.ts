export type HistoryData = {
  date: string;
  value: number;
};

export interface IRiverInfoData {
  riverGaugeId: string;
  source: string;
  latitude: string;
  longitude: string;
  stationName: string;
  forecastDate: string;
  basinSize: string;
  warningLevel: number;
  dangerLevel: number;
  extremeDangerLevel: number;
  history: HistoryData[];
}

export interface IRiverData {
  id: string;
  info: IRiverInfoData;
}
