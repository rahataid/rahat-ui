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
import { Option } from '../utils';
import { useGetSeriesByDataSource } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

const operatorOptions = [
  { label: 'Greater than (>)', value: '>' },
  { label: 'Less than (<)', value: '<' },
  { label: 'Equal (=)', value: '=' },
  { label: 'Greater than or equal (>=)', value: '>=' },
  { label: 'Less than or equal (<=)', value: '<=' },
];

const SOURCE_META = {
  water_level_m: {
    unit: 'm',
    placeholder: 'Enter water level value in (m)',
  },
  discharge_m3s: {
    unit: 'm³/s',
    placeholder: 'Enter discharge value in m³/s',
  },
  rainfall_mm: {
    unit: 'mm',
    placeholder: 'Enter rainfall value in (mm)',
  },
  prob_flood: {
    unit: '%',
    placeholder: 'Enter flood probability value in (%)',
  },
} as const;

type IProps = {
  form: UseFormReturn<z.infer<typeof AutomatedFormSchema>>;
  phase: any;
  isEditing?: boolean;
  sourceOptions?: Option[];
  subTypeOptions?: Record<string, Option[]>;
};

export default function AddAutomatedTriggerForm({
  form,
  phase,
  isEditing,
  sourceOptions,
  subTypeOptions,
}: IProps) {
  const source = form.watch('source');
  const triggerSource = form.watch('triggerStatement.source');
  const triggerSourceSubType = form.watch('triggerStatement.sourceSubType');
  const triggerOperator = form.watch('triggerStatement.operator');
  const triggerValue = form.watch('triggerStatement.value');
  const [selectedSource, setSelectedSource] = React.useState<{
    dataSource: string | null;
    type: string | null;
  }>({ dataSource: null, type: null });
  const params = useParams();
  const projectId = params.id as UUID;

  const { data: seriesList, isLoading } = useGetSeriesByDataSource(
    projectId,
    selectedSource.dataSource?.toUpperCase() || '',
    selectedSource.type?.toUpperCase() || '',
  );

  React.useEffect(() => {
    if (source) {
      // Reset source-related fields when source changes
      form.setValue('triggerStatement.sourceSubType', '');
      form.setValue('triggerStatement.stationId', '');
      form.setValue('triggerStatement.stationName', '');
      form.setValue('triggerStatement.operator', undefined);
      form.setValue('triggerStatement.value', undefined);
      form.setValue('triggerStatement.expression', '');

      switch (source) {
        case 'dhm:waterlevel':
          form.setValue('triggerStatement.source', 'water_level_m');
          break;
        case 'dhm:rainfall':
          form.setValue('triggerStatement.source', 'rainfall_mm');
          break;
        case 'glofas':
          form.setValue('triggerStatement.source', 'prob_flood');
          break;
        case 'gfh':
          form.setValue('triggerStatement.source', 'discharge_m3s');
          break;
        default:
          break;
      }
    }
  }, [source, form]);

  React.useEffect(() => {
    if (triggerSourceSubType && triggerOperator && triggerValue) {
      form.setValue(
        'triggerStatement.expression',
        `${triggerSourceSubType} ${triggerOperator} ${triggerValue}`,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );
    }
  }, [triggerSourceSubType, triggerOperator, triggerValue]);

  const SourceSubTypeField = ({ label }: { label: string }) => {
    return (
      <>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {subTypeOptions?.[source]?.length ? (
            subTypeOptions?.[source]?.map((option) => (
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
                      onValueChange={(v) => {
                        field.onChange(v);
                        const [dataSource, type] = v.includes(':')
                          ? v.split(':')
                          : [v, null];
                        const mappedType =
                          type === 'waterlevel' ? 'water_level' : type;
                        setSelectedSource({ dataSource, type: mappedType });
                      }}
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
                        {sourceOptions?.length ? (
                          sourceOptions?.map((option) => (
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

            {!isEditing && source && (
              <div className="col-span-2 bg-[#fcfcfd] gap-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="triggerStatement.sourceSubType"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            key={field.value}
                          >
                            {triggerSource === 'water_level_m' && (
                              <SourceSubTypeField label="Level Type" />
                            )}
                            {triggerSource === 'discharge_m3s' && (
                              <SourceSubTypeField label="Discharge Type" />
                            )}
                            {triggerSource === 'rainfall_mm' && (
                              <SourceSubTypeField label="Measurement Period" />
                            )}
                            {triggerSource === 'prob_flood' && (
                              <SourceSubTypeField label="Probability Period" />
                            )}
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  {source && source !== 'glofas' && (
                    <FormField
                      control={form.control}
                      name="triggerStatement.stationId"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                const selected = seriesList.find(
                                  (s: any) => s.seriesId?.toString() === value,
                                );
                                form.setValue(
                                  'triggerStatement.stationName',
                                  selected?.stationName || '',
                                );
                              }}
                              value={field.value}
                              key={field.value}
                              disabled={isEditing}
                            >
                              <FormLabel>Station</FormLabel>
                              <FormControl>
                                <SelectTrigger
                                  className={isEditing ? 'bg-gray-300' : ''}
                                >
                                  <SelectValue placeholder="Select Station" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {seriesList?.length ? (
                                  seriesList?.map((option: any) => (
                                    <SelectItem
                                      key={option.seriesId}
                                      value={option.seriesId?.toString()}
                                    >
                                      {option.stationName}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <p className="text-gray-500 text-sm">
                                    No station found
                                  </p>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  )}
                </div>
                {triggerSourceSubType && (
                  <div className="col-span-2">
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
                            const meta = SOURCE_META[triggerSource];

                            return (
                              <FormItem>
                                <FormLabel>
                                  Value {meta?.unit ? `(${meta.unit})` : ''}
                                </FormLabel>

                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder={meta?.placeholder}
                                    step="1"
                                    min="1"
                                    max={
                                      source === 'glofas' ? '100' : undefined
                                    }
                                    {...field}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
                {triggerValue && (
                  <div className="col-span-2">
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
