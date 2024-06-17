import { X } from 'lucide-react';
import SelectFormField from '../../../../../../components/select.form.field';
import InputFormField from '../../../../../../components/input.form.field';
import { useSelectItems } from './useSelectItems';

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
  } = useSelectItems();

  const renderFieldsBasedOnSource = () => {
    const selectedSource = form.watch(`dataSource.${index}.source`);
    let fields;
    switch (selectedSource) {
      case 'DHM':
        fields = (
          <>
            <SelectFormField
              form={form}
              name={`dataSource.${index}.forecast`}
              label="Forecast"
              placeholder="Select forecast"
              selectItems={dhmForecastSelectItems}
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
              name={`dataSource.${index}.todayGLOFAS`}
              label="Today"
              placeholder="Enter today's status"
            />
            <InputFormField
              form={form}
              name={`dataSource.${index}.days3`}
              label="3 days"
              placeholder="Enter 3 day's status"
            />
            <InputFormField
              form={form}
              name={`dataSource.${index}.days5`}
              label="5 days"
              placeholder="Enter 5 day's status"
            />
            <InputFormField
              form={form}
              name={`dataSource.${index}.inBetweenTodayUntil7DaysIsThereAnyPossibilityOfPeak`}
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
            name={`dataSource.${index}.status`}
            label="Status"
            placeholder="Select status"
            selectItems={flashFloodRiskSelectItems}
          />
        );
        break;
      case 'NCMWRF Accumulated':
        fields = (
          <>
            <SelectFormField
              form={form}
              name={`dataSource.${index}.heavyRainfallForecastInKarnaliBasin`}
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
              name={`dataSource.${index}.hours24`}
              label="24 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name={`dataSource.${index}.hours72`}
              label="72 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name={`dataSource.${index}.hours168`}
              label="168 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
          </>
        );
        break;
      case 'NCMWRF Deterministic & Probabilistic':
        fields = (
          <>
            <InputFormField
              form={form}
              name={`dataSource.${index}.extremeWeatherOutlook`}
              label="Extreme Weather Outlook"
              subLabel="Severe Weather Event -Extreme Rainfall >95 Percentile purple dots over Karnali Watershed"
              placeholder="Enter status"
            />
            <InputFormField
              form={form}
              name={`dataSource.${index}.deterministicsPredictionSystem`}
              label="Deterministics Prediction System"
              subLabel="Predicts commulative rainfall more than 300 MM in next 3 to 5 Days"
              placeholder="Enter status"
            />
            <InputFormField
              form={form}
              name={`dataSource.${index}.probabilisticPredictionSystem`}
              label="Probabilistic Prediction System"
              subLabel="Heavy Rainfall 115 MM per day 80 percent probablity in next 3 to 5 days"
              placeholder="Enter status"
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
    const selectedForecast = form.watch(`dataSource.${index}.forecast`);
    let fields;
    switch (selectedForecast) {
      case '3 Days Flood forecast Bulletin':
        fields = (
          <>
            <SelectFormField
              form={form}
              name={`dataSource.${index}.today`}
              label="Today"
              placeholder="Select status"
              selectItems={floodForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={`dataSource.${index}.tomorrow`}
              label="Tomorrow"
              placeholder="Select status"
              selectItems={floodForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={`dataSource.${index}.dayAfterTomorrow`}
              label="Day After Tomorrow"
              placeholder="Select status"
              selectItems={floodForecastSelectItems}
            />
          </>
        );
        break;
      case '3 Days Rainfall forecast Bulletin':
        fields = (
          <>
            <SelectFormField
              form={form}
              name={`dataSource.${index}.todayAfternoon`}
              label="Today Afternoon"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={`dataSource.${index}.todayNight`}
              label="Today Night"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={`dataSource.${index}.tomorrowAfternoon`}
              label="Tomorrow Afternoon"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={`dataSource.${index}.tomorrowNight`}
              label="Tomorrow Night"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={`dataSource.${index}.dayAfterTomorrowAfternoon`}
              label="Day After Tomorrow Afternoon"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
            <SelectFormField
              form={form}
              name={`dataSource.${index}.dayAfterTomorrowNight`}
              label="Day After Tomorrow Night"
              placeholder="Select status"
              selectItems={rainfallForecastSelectItems}
            />
          </>
        );
        break;
      case 'Real time Monitoring(River Watch)':
        fields = (
          <InputFormField
            form={form}
            name={`dataSource.${index}.waterLevel`}
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
              name={`dataSource.${index}.hours24NWP`}
              label="24 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name={`dataSource.${index}.hours48`}
              label="48 hours"
              placeholder="Select status"
              selectItems={rainfallSelectItems}
            />
            <SelectFormField
              form={form}
              name={`dataSource.${index}.hours72NWP`}
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
        <h1 className="text-md font-semibold">Add another data source</h1>
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
          selectItems={dataSourceSelectItems}
        />
        {renderFieldsBasedOnSource()}
      </div>
    </div>
  );
}
