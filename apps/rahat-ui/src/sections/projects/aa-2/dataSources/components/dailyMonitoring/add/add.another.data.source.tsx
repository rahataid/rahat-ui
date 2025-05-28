import { X } from 'lucide-react';
import { useSelectItems } from '../useSelectItems';
import React from 'react';
import SelectFormField from '../select.form.field';
import InputFormField from '../input.form.field';

type IProps = {
  form: any;
  onClose: VoidFunction;
  index: number;
};

export default function AddAnotherDataSource({ form, onClose, index }: IProps) {
  const fieldName = (name: string) => `dataSource.${index}.${name}`; // Dynamic field name generator

  const {
    dataSourceSelectItems,
    dhmForecastSelectItems,
    flashFloodRiskSelectItems,
    rainfallForecastSelectItems,
    rainfallSelectItems,
    floodForecastSelectItems,
    gauageReadingStationSelectItems,
  } = useSelectItems();

  const selectedDataSourceObjArray = form.watch('dataSource');

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
              label="Forecast"
              placeholder="Select forecast"
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
              label="Today"
              placeholder="Enter today's status"
            />
            <InputFormField
              form={form}
              name={fieldName('days3')}
              label="3 days"
              placeholder="Enter 3 day's status"
            />
            <InputFormField
              form={form}
              name={fieldName('days5')}
              label="5 days"
              placeholder="Enter 5 day's status"
            />
            <InputFormField
              form={form}
              name={fieldName(
                'inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak',
              )}
              label="In between today until 7 Days is there any possibility of peak"
              placeholder="Enter possibility"
            />
          </>
        );
        break;
      case 'Flash Flood Risk Monitoring':
        fields = (
          <SelectFormField
            form={form}
            name={fieldName('status')}
            label="Status"
            placeholder="Select status"
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
              label="Heavy Rainfall Forecast in Karnali Basin (upstream areas)"
              subLabel="(more than 100mm in consecutive 2-3 days)"
              placeholder="Select status"
              selectItems={[
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' },
              ]}
            />
            <SelectFormField
              form={form}
              name={fieldName('hours24')}
              label="24 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('hours72')}
              label="72 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('hours168')}
              label="168 hours"
              placeholder="Select status"
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
              label="Extreme Weather Outlook"
              subLabel="Severe Weather Event -Extreme Rainfall >95 Percentile purple dots over Karnali Watershed"
              placeholder="Enter status"
            />
            <InputFormField
              form={form}
              name={fieldName('deterministicsPredictionSystem')}
              label="Deterministics Prediction System"
              subLabel="Predicts commulative rainfall more than 300 MM in next 3 to 5 Days"
              placeholder="Enter status"
            />
            <InputFormField
              form={form}
              name={fieldName('probabilisticPredictionSystem')}
              label="Probabilistic Prediction System"
              subLabel="Heavy Rainfall 115 MM per day 80 percent probablity in next 3 to 5 days"
              placeholder="Enter status"
            />
          </>
        );
        break;
      case 'Gauge Reading':
        fields = (
          <>
            <SelectFormField
              form={form}
              name={fieldName('station')}
              label="station"
              placeholder="Select station"
              selectItems={gauageReadingStationSelectItems}
            />
            <InputFormField
              form={form}
              name={fieldName('gaugeReading')}
              label="Gauge Reading (mm)"
              placeholder="Enter gauge reading"
            />
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
              label="Today"
              placeholder="Select status"
              selectItems={floodForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('tomorrow')}
              label="Tomorrow"
              placeholder="Select status"
              selectItems={floodForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('dayAfterTomorrow')}
              label="Day After Tomorrow"
              placeholder="Select status"
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
              label="Today Afternoon"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('todayNight')}
              label="Today Night"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('tomorrowAfternoon')}
              label="Tomorrow Afternoon"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('tomorrowNight')}
              label="Tomorrow Night"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('dayAfterTomorrowAfternoon')}
              label="Day After Tomorrow Afternoon"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('dayAfterTomorrowNight')}
              label="Day After Tomorrow Night"
              placeholder="Select status"
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
            label="Water Level(Meter)"
            subLabel="Danger Level 10.8m"
            placeholder="Enter Water Level"
          />
        );
        break;
      case 'NWP':
        fields = (
          <>
            <SelectFormField
              form={form}
              name={fieldName('hours24NWP')}
              label="24 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('hours48')}
              label="48 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name={fieldName('hours72NWP')}
              label="72 hours"
              placeholder="Select status"
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

  return (
    <div className="border border-dashed rounded-sm p-4 my-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-md font-semibold">Data Source Reporting</h1>
        <div className="p-0.5 rounded-full bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 cursor-pointer">
          <X size={16} strokeWidth={2.5} onClick={onClose} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SelectFormField
          form={form}
          name={fieldName('source')}
          label="Source"
          placeholder="Select Data Source"
          selectItems={newSourceSelectItemsArray}
        />
        {renderFieldsBasedOnSource()}
      </div>
    </div>
  );
}
