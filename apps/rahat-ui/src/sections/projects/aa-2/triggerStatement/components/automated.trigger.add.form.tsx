import * as React from 'react';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import { z } from 'zod';
import { Info } from 'lucide-react';
import { AutomatedFormSchema } from '../add.trigger.view';

const sourceOptionss = [
  { label: 'DHM Water Level - Water Level (m)', value: 'DHM_Water_Level' },
  { label: 'GFH - Discharge (m³/s)', value: 'GFH' },
  { label: 'DHM Rainfall - Rainfall (mm)', value: 'DHM_Rainfall' },
  { label: 'GLOFAS - Flood Probability (%)', value: 'GLOFAS' },
];

const dhmLevelTypeOptions = [
  { label: 'Warning Level', value: 'warning_level' },
  { label: 'Danger Level', value: 'danger_level' },
];

const gfhLevelTypeOptions = [
  { label: 'Warning Discharge', value: 'warning_discharge' },
  { label: 'Danger Discharge', value: 'danger_discharge' },
];

const dhmMeasurementPeriodOptions = [
  { label: 'Hourly', value: 'hourly' },
  { label: 'Daily', value: 'daily' },
];

const glofasProbabilityPeriodOptions = [
  { label: '2 Years Max Prob', value: '2_years_max_prob' },
  { label: '5 Years Max Prob', value: '5_years_max_prob' },
  { label: '20 Years Max Prob', value: '20_years_max_prob' },
];

const operatorOptions = [
  { label: 'Greater than (>)', value: '>' },
  { label: 'Less than (<)', value: '<' },
  { label: 'Equal (=)', value: '=' },
  { label: 'Greater than or equal (>=)', value: '>=' },
  { label: 'Less than or equal (<=)', value: '<=' },
];

type IProps = {
  form: UseFormReturn<z.infer<typeof AutomatedFormSchema>>;
  phase: any;
  isEditing?: boolean;
  sourceOptions?: { label: string; value: string }[];
};

export default function AddAutomatedTriggerForm({
  form,
  phase,
  isEditing,
  sourceOptions,
}: IProps) {
  const source = form.watch('source');
  const triggerSource = form.watch('triggerStatement.source');
  const triggerSourceSubType = form.watch('triggerStatement.sourceSubType');
  const triggerOperator = form.watch('triggerStatement.operator');
  const triggerValue = form.watch('triggerStatement.value');

  React.useEffect(() => {
    if (source) {
      switch (source) {
        case 'DHM_Water_Level':
          form.setValue('triggerStatement.source', 'water_level_m');
          break;
        case 'DHM_Rainfall':
          form.setValue('triggerStatement.source', 'rainfall_mm');
          break;
        case 'GLOFAS':
          form.setValue('triggerStatement.source', 'prob_flood');
          break;
        case 'GFH':
          form.setValue('triggerStatement.source', 'discharge_m3s');
          break;
        default:
          break;
      }
    }
  }, [source]);

  React.useEffect(() => {
    if (triggerSourceSubType && triggerOperator && triggerValue) {
      form.setValue(
        'triggerStatement.expression',
        `${triggerSourceSubType} ${triggerOperator} ${triggerValue}`,
      );
    }
  }, [triggerSourceSubType, triggerOperator, triggerValue]);

  const SourceSubTypeField = ({
    label,
    options,
  }: {
    label: string;
    options: { label: string; value: string }[];
  }) => {
    return (
      <>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options?.length ? (
            options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No type found</p>
          )}
        </SelectContent>
      </>
    );
  };

  const SourceValueField = ({
    field,
    unit,
    placeholder,
  }: {
    field: ControllerRenderProps<
      z.infer<typeof AutomatedFormSchema>,
      'triggerStatement.value'
    >;
    unit: string;
    placeholder: string;
  }) => {
    return (
      <>
        <FormLabel>Value ({unit})</FormLabel>
        <FormControl>
          <Input type="number" placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </>
    );
  };
  return (
    <>
      <Form {...form}>
        <form>
          <div className="mt-4 grid grid-cols-2 gap-4 ">
            <FormItem>
              <FormLabel>Phase</FormLabel>
              <FormControl>
                <Input
                  className="bg-gray-300"
                  type="text"
                  value={phase?.name}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>River Basin</FormLabel>
              <FormControl>
                <Input
                  className="bg-gray-300"
                  type="text"
                  value={phase?.riverBasin}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Trigger Title</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Trigger Title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      key={field.value}
                      disabled={isEditing}
                    >
                      <FormLabel>Source</FormLabel>
                      <FormControl>
                        <SelectTrigger
                          className={isEditing ? 'bg-gray-300' : ''}
                        >
                          <SelectValue placeholder="Select Source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sourceOptionss?.length ? (
                          sourceOptionss?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">
                            No source found
                          </p>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {source && (
              <div className="bg-[#fcfcfd] border rounded-sm p-4 col-span-2 gap-4">
                <FormField
                  control={form.control}
                  name="triggerStatement.sourceSubType"
                  render={({ field }) => {
                    return (
                      <FormItem className="w-1/2 pr-2 mb-4">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          key={field.value}
                        >
                          {triggerSource === 'water_level_m' && (
                            <SourceSubTypeField
                              label="Level Type"
                              options={dhmLevelTypeOptions}
                            />
                          )}
                          {triggerSource === 'discharge_m3s' && (
                            <SourceSubTypeField
                              label="Discharge Type"
                              options={gfhLevelTypeOptions}
                            />
                          )}
                          {triggerSource === 'rainfall_mm' && (
                            <SourceSubTypeField
                              label="Measurement Period"
                              options={dhmMeasurementPeriodOptions}
                            />
                          )}
                          {triggerSource === 'prob_flood' && (
                            <SourceSubTypeField
                              label="Probability Period"
                              options={glofasProbabilityPeriodOptions}
                            />
                          )}
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {triggerSourceSubType && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="triggerStatement.operator"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              key={field.value}
                            >
                              <FormLabel>Operator</FormLabel>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Operator" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {operatorOptions?.length ? (
                                  operatorOptions?.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <p className="text-gray-500 text-sm">
                                    No operator found
                                  </p>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    {triggerOperator && (
                      <FormField
                        control={form.control}
                        name="triggerStatement.value"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              {triggerSource === 'water_level_m' && (
                                <SourceValueField
                                  field={field}
                                  unit="m"
                                  placeholder="Enter water level value in (m)"
                                />
                              )}
                              {triggerSource === 'discharge_m3s' && (
                                <SourceValueField
                                  field={field}
                                  unit="m³/s"
                                  placeholder="Enter discharge value in m³/s"
                                />
                              )}
                              {triggerSource === 'rainfall_mm' && (
                                <SourceValueField
                                  field={field}
                                  unit="mm"
                                  placeholder="Enter rainfall value in (mm)"
                                />
                              )}
                              {triggerSource === 'prob_flood' && (
                                <SourceValueField
                                  field={field}
                                  unit="%"
                                  placeholder="Enter flood probability value in (%)"
                                />
                              )}
                            </FormItem>
                          );
                        }}
                      />
                    )}
                  </div>
                )}
                {triggerValue && (
                  <div>
                    <div className="flex space-x-2 items-center ">
                      <p className="text-sm/6 text-primary">
                        Generated Expression
                      </p>
                      <Info color="gray" size={18} />
                    </div>
                    <p className="text-sm">
                      {triggerSource} {triggerOperator} {triggerSourceSubType} (
                      {triggerValue}{' '}
                      {triggerSource === 'water_level_m'
                        ? 'm'
                        : triggerSource === 'discharge_m3s'
                        ? 'm³/s'
                        : triggerSource === 'rainfall_mm'
                        ? 'mm'
                        : triggerSource === 'prob_flood'
                        ? '%'
                        : ''}
                      )
                    </p>
                  </div>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem className="col-span-2">
                    <FormLabel>Trigger description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write trigger description here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="isMandatory"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="ml-2">Optional</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </>
  );
}
