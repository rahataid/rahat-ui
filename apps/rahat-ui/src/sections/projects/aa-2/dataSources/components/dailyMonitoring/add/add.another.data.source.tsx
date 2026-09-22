import { X } from 'lucide-react';
import { useSelectItems } from '../useSelectItems';
import React, { Fragment, useCallback, useEffect } from 'react';
import SelectFormField from '../select.form.field';
import InputFormField from '../input.form.field';
import { useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';

type IProps = {
  form: any;
  onClose?: VoidFunction;
  index: number;
  showRemoveButton?: boolean;
};

export default function AddAnotherDataSource({
  form,
  onClose,
  index,
  showRemoveButton,
}: IProps) {
  const t = useTranslations('AA_PROJECT');
  const fieldName = useCallback(
    (name: string) => `dataSource.${index}.${name}`,
    [index],
  ); // Dynamic field name generator

  const selectedSource = useWatch({
    control: form.control,
    name: fieldName('source'),
  });
  const {
    dataSourceSelectItems,
    dhmForecastSelectItems,
    flashFloodRiskSelectItems,
    rainfallForecastSelectItems,
    rainfallSelectItems,
    floodForecastSelectItems,
    gaugeReadingRainfallStationItems,
    gaugeReadingRiverStationItems,
    possibility,
    gaugeForecastDataSourceSelectItems,
  } = useSelectItems();

  const selectedDataSourceObjArray = form.watch('dataSource');
  const selectedGaugeForecast = useWatch({
    control: form.control,
    name: fieldName('gaugeForecast'),
  });
  const gaugeReadingOptions =
    selectedGaugeForecast === 'rainfallWatch'
      ? gaugeReadingRainfallStationItems
      : gaugeReadingRiverStationItems;

  const selectedSourceStringArray = selectedDataSourceObjArray?.map(
    (obj: any) => obj.source,
  );
  const newSourceSelectItemsArray = dataSourceSelectItems.map((obj) => {
    if (selectedSourceStringArray.includes(obj.value) && obj.value !== 'DHM') {
      return { ...obj, isDisabled: true };
    }
    return obj;
  });

  const selectedDHMForecastStringArray = selectedDataSourceObjArray?.map(
    (obj: any) => (obj.source === 'DHM' ? obj.forecast : ''),
  );
  const newDHMForecastSelectItemsArray = dhmForecastSelectItems.map((obj) => {
    if (selectedDHMForecastStringArray.includes(obj.value)) {
      return { ...obj, isDisabled: true };
    }
    return obj;
  });

  const renderFieldsBasedOnSource = () => {
    const selectedSource = form.watch(fieldName('source'));
    let fields;
    switch (selectedSource) {
      case 'DHM':
        fields = (
          <>
            <SelectFormField
              form={form}
              name={fieldName('forecast')}
              label={t('FORECAST')}
              placeholder={t('SELECT_FORECAST')}
              selectItems={newDHMForecastSelectItemsArray}
            />
            {renderFieldsBasedOnDHMForecast()}
          </>
        );
        break;
      case 'GLOFAS':
        fields = (
          <>
            <InputFormField
              form={form}
              name={fieldName('todayGLOFAS')}
              label={t('TODAY')}
              placeholder={t('ENTER_TODAYS_STATUS')}
            />
            <InputFormField
              form={form}
              name={fieldName('days3')}
              label={t('N3_DAYS')}
              placeholder={t('ENTER_3_DAYS_STATUS')}
            />
            <InputFormField
              form={form}
              name={fieldName('days5')}
              label={t('N5_DAYS')}
              placeholder={t('ENTER_5_DAYS_STATUS')}
            />
            <SelectFormField
              form={form}
              name={fieldName(
                'inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak',
              )}
              label={t('IN_BETWEEN_TODAY_UNTIL7_DAYS')}
              placeholder={t('SELECT_POSSIBILITY')}
              selectItems={possibility}
            />
          </>
        );
        break;
      case 'Flash Flood Risk Monitoring':
        fields = (
          <SelectFormField
            form={form}
            name={fieldName('status')}
            label={t('STATUS')}
            placeholder={t('SELECT_STATUS')}
            selectItems={flashFloodRiskSelectItems}
          />
        );
        break;
      case 'NCMRWF Accumulated':
        fields = (
          <>
            <SelectFormField
              form={form}
              name={fieldName('heavyRainfallForecastInKarnaliBasin')}
              label={t('HEAVY_RAINFALL_FORECAST_IN_KARNALI_BASIN')}
              subLabel={t('HEAVY_RAINFALL_SUBLABEL')}
              placeholder={t('SELECT_STATUS')}
              selectItems={[
                { value: 'Yes', label: t('YES') },
                { value: 'No', label: t('NO') },
              ]}
            />
            <SelectFormField
              form={form}
              name={fieldName('hours24')}
              label={t('N24_HOURS')}
              placeholder={t('SELECT_STATUS')}
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('hours72')}
              label={t('N72_HOURS')}
              placeholder={t('SELECT_STATUS')}
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('hours168')}
              label={t('N168_HOURS')}
              placeholder={t('SELECT_STATUS')}
              selectItems={rainfallSelectItems}
            />
          </>
        );
        break;
      case 'NCMRWF Deterministic & Probabilistic':
        fields = (
          <>
            <InputFormField
              form={form}
              name={fieldName('extremeWeatherOutlook')}
              label={t('EXTREME_WEATHER_OUTLOOK')}
              subLabel="Severe Weather Event -Extreme Rainfall >95 Percentile purple dots over Karnali Watershed"
              placeholder={t('ENTER_STATUS')}
            />
            <InputFormField
              form={form}
              name={fieldName('deterministicsPredictionSystem')}
              label={t('DETERMINISTICS_PREDICTION_SYSTEM')}
              subLabel={t('DETERMINISTICS_SUBLABEL')}
              placeholder={t('ENTER_STATUS')}
            />
            <InputFormField
              form={form}
              name={fieldName('probabilisticPredictionSystem')}
              label={t('PROBABILISTIC_PREDICTION_SYSTEM')}
              subLabel={t('PROBABILISTIC_SUBLABEL')}
              placeholder={t('ENTER_STATUS')}
            />
          </>
        );
        break;
      case 'Gauge Reading':
        fields = (
          <>
            <SelectFormField
              form={form}
              name={fieldName('gaugeForecast')}
              label={t('FORECAST')}
              placeholder={t('SELECT_FORECAST')}
              selectItems={gaugeForecastDataSourceSelectItems}
            />
            {selectedGaugeForecast && (
              <>
                <SelectFormField
                  key={`station-${selectedGaugeForecast}`}
                  form={form}
                  name={fieldName('station')}
                  label={t('STATION')}
                  placeholder={
                    selectedGaugeForecast === 'riverWatch'
                      ? 'Select River Station'
                      : selectedGaugeForecast === 'rainfallWatch'
                      ? 'Select Rainfall Station'
                      : t('SELECT_STATION')
                  }
                  selectItems={gaugeReadingOptions}
                />
                <InputFormField
                  form={form}
                  name={fieldName('gaugeReading')}
                  label={`${t('GAUGE_READING')} ${
                    selectedGaugeForecast === 'riverWatch' ? '(m)' : '(mm)'
                  }`}
                  placeholder={t('ENTER_GAUGE_READING')}
                />
              </>
            )}
          </>
        );
        break;

      default:
        break;
    }
    return fields;
  };

  const renderFieldsBasedOnDHMForecast = () => {
    const selectedForecast = form.watch(fieldName('forecast'));
    let fields;
    switch (selectedForecast) {
      case '3 Days Flood Forecast Bulletin':
        fields = (
          <>
            <SelectFormField
              form={form}
              name={fieldName('today')}
              label={t('TODAY')}
              placeholder={t('SELECT_STATUS')}
              selectItems={floodForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('tomorrow')}
              label={t('TOMORROW')}
              placeholder={t('SELECT_STATUS')}
              selectItems={floodForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('dayAfterTomorrow')}
              label={t('DAY_AFTER_TOMORROW')}
              placeholder={t('SELECT_STATUS')}
              selectItems={floodForecastSelectItems}
            />
          </>
        );
        break;
      case '3 Days Rainfall Forecast Bulletin':
        fields = (
          <>
            <SelectFormField
              form={form}
              name={fieldName('todayAfternoon')}
              label={t('TODAY_AFTERNOON')}
              placeholder={t('SELECT_STATUS')}
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('todayNight')}
              label={t('TODAY_NIGHT')}
              placeholder={t('SELECT_STATUS')}
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('tomorrowAfternoon')}
              label={t('TOMORROW_AFTERNOON')}
              placeholder={t('SELECT_STATUS')}
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('tomorrowNight')}
              label={t('TOMORROW_NIGHT')}
              placeholder={t('SELECT_STATUS')}
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('dayAfterTomorrowAfternoon')}
              label={t('DAY_AFTER_TOMORROW_AFTERNOON')}
              placeholder={t('SELECT_STATUS')}
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('dayAfterTomorrowNight')}
              label={t('DAY_AFTER_TOMORROW_NIGHT')}
              placeholder={t('SELECT_STATUS')}
              selectItems={rainfallForecastSelectItems}
            />
          </>
        );
        break;
      case 'Realtime Monitoring (River Watch)':
        fields = (
          <InputFormField
            form={form}
            name={fieldName('waterLevel')}
            label={t('WATER_LEVEL_METER')}
            subLabel={t('DANGER_LEVEL108M')}
            placeholder={t('ENTER_WATER_LEVEL')}
          />
        );
        break;
      case 'NWP':
        fields = (
          <>
            <SelectFormField
              form={form}
              name={fieldName('hours24NWP')}
              label={t('N24_HOURS')}
              placeholder={t('SELECT_STATUS')}
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('hours48')}
              label={t('N48_HOURS')}
              placeholder={t('SELECT_STATUS')}
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('hours72NWP')}
              label={t('N72_HOURS')}
              placeholder={t('SELECT_STATUS')}
              selectItems={rainfallSelectItems}
            />
          </>
        );
        break;
      default:
        break;
    }
    return fields;
  };

  useEffect(() => {
    form.setValue(fieldName('station'), '');
    form.setValue(fieldName('gaugeReading'), '');
  }, [selectedGaugeForecast]);

  return (
    <div className="border border-dashed rounded-sm p-4 my-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex  flex-col">
          <h1 className="text-md font-semibold">{t('DATA_SOURCE_REPORTING')}</h1>
          <p className="text-sm text-muted-foreground leading-normal">
            {t('SELECT_A_DATA_SOURCE_BELOW_AND')}
          </p>
        </div>
        {showRemoveButton && (
          <div className="p-1 rounded-sm bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 cursor-pointer">
            <X size={14} strokeWidth={2.5} onClick={onClose} />
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SelectFormField
          form={form}
          name={fieldName('source')}
          label={t('SOURCE')}
          placeholder={t('SELECT_DATA_SOURCE')}
          selectItems={newSourceSelectItemsArray}
        />
        <Fragment key={form.watch(fieldName('source'))}>
          {renderFieldsBasedOnSource()}
        </Fragment>
      </div>
    </div>
  );
}
