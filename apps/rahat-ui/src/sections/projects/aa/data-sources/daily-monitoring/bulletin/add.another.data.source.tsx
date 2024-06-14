import { X } from 'lucide-react';
import SelectFormField from './select.form.field';

type IProps = {
  form: any;
  onClose: VoidFunction;
  index: number;
};

export default function AddAnotherDataSource({ form, onClose, index }: IProps) {
  const fieldName = (name: string) => `dataSource.${index}.${name}`; // Dynamic field name generator

  const renderConditionalFields = () => {
    const selectedSource = form.watch(`dataSource.${index}.source`);
    let fields;
    switch (selectedSource) {
      case 'DHM':
        fields = (
          <>
            <SelectFormField
              form={form}
              name={`dataSource.${index}.todayStatus`}
              label="Today's status"
              placeholder="Select status"
              selectItems={[{ value: 'status1', label: 'Status 1' }]}
            />
            <SelectFormField
              form={form}
              name={`dataSource.${index}.tomorrowStatus`}
              label="Tomorrow's status"
              placeholder="Select status"
              selectItems={[{ value: 'status1', label: 'Status 1' }]}
            />
            <SelectFormField
              form={form}
              name={`dataSource.${index}.dayAfterTomorrowStatus`}
              label="The day after tomorrow's status"
              placeholder="Select status"
              selectItems={[{ value: 'status1', label: 'Status 1' }]}
            />
          </>
        );
        break;
      case 'NCMWRF':
        fields = (
          <>
            <SelectFormField
              form={form}
              name={`dataSource.${index}.hours24Status`}
              label="24 hours"
              placeholder="Select status"
              selectItems={[{ value: 'status1', label: 'Status 1' }]}
            />
            <SelectFormField
              form={form}
              name={`dataSource.${index}.hours48Status`}
              label="48 hours"
              placeholder="Select status"
              selectItems={[{ value: 'status1', label: 'Status 1' }]}
            />
            <SelectFormField
              form={form}
              name={`dataSource.${index}.hours72Status`}
              label="72 hours"
              placeholder="Select status"
              selectItems={[{ value: 'status1', label: 'Status 1' }]}
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
          selectItems={[
            { value: 'DHM', label: 'DHM' },
            { value: 'NCMWRF', label: 'NCMWRF' },
          ]}
        />
        <SelectFormField
          form={form}
          name={fieldName('forecast')}
          label="Forecast"
          placeholder="Select Forecast"
          selectItems={[
            { value: 'forecast1', label: 'Forecast 1' },
            { value: 'forecast2', label: 'Forecast 2' },
          ]}
        />
        {renderConditionalFields()}
      </div>
    </div>
  );
}
