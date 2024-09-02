import * as React from 'react';
import { useParams } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
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
import { UUID } from 'crypto';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';

type IProps = {
  form: UseFormReturn<
    {
      title: string;
      dataSource: string;
      isMandatory?: boolean | undefined;
      waterLevel: string;
    },
    any,
    undefined
  >;
};

export default function AddAutomatedTriggerForm({ form }: IProps) {
  const params = useParams();
  const projectId = params.id as UUID;
  const selectedPhase = JSON.parse(
    localStorage.getItem('selectedPhase') as string,
  );

  const dataSources = useProjectSettingsStore(
    (s) => s.settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.DATASOURCE],
  );

  const dhmStations = [
    {
      title: dataSources.dhm.location,
    },
  ];

  return (
    <>
      <Form {...form}>
        <form>
          <div className="mt-4 grid gap-4">
            <FormItem className="w-full">
              <FormLabel>Selected Phase</FormLabel>
              <FormControl>
                <Input type="text" value={selectedPhase.name} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
            <div className="w-full flex gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
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
                name="dataSource"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormLabel>Source</FormLabel>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={'DHM'}>
                            Department of Hydrology and Meteorology (DHM)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="w-full flex gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormLabel>River Basin</FormLabel>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select River Basin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dhmStations?.map((r: any) => {
                            return (
                              <SelectItem key={r.id} value={r.title}>
                                {r.title}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <FormField
              control={form.control}
              name="waterLevel"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Threshold Level</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        // inputMode="decimal"
                        // pattern="[0-9]*[.,]?[0-9]*"
                        // title="Please enter positive number"
                        placeholder="Enter water Level"
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
              render={({ field }) => {
                return (
                  <div className="grid gap-2 pl-2">
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Is Mandatory Trigger?
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  </div>
                );
              }}
            />
          </div>
        </form>
      </Form>
    </>
  );
}
