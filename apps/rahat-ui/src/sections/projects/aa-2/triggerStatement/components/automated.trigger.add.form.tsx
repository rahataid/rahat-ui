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
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import ConfirmAddTrigger from './confirm.add.trigger';

type IProps = {
  form: UseFormReturn<
    {
      title: string;
      dataSource: string;
      isMandatory?: boolean | undefined;
      minLeadTimeDays: string;
      maxLeadTimeDays: string;
      probability: string;
      notes?: string;
    },
    any,
    undefined
  >;
  phase: any;
};

export default function AddAutomatedTriggerForm({ form, phase }: IProps) {
  // const params = useParams();
  // const projectId = params.id as UUID;
  // const selectedPhase = JSON.parse(
  //   localStorage.getItem('selectedPhase') as string,
  // );

  // const dataSources = useProjectSettingsStore(
  //   (s) => s.settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.DATASOURCE],
  // );

  // const riverBasin = dataSources?.glofas?.location;

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
              name="dataSource"
              render={({ field }) => {
                return (
                  <FormItem>
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
                        <SelectItem value={phase?.source}>
                          {phase?.source}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => {
                return (
                  <FormItem className="col-span-2">
                    <FormLabel>Trigger Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write trigger notes here"
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
              name="minLeadTimeDays"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Minimum Lead Time Days</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        // pattern="[0-9]*[.,]?[0-9]*"
                        // title="Please enter positive number"
                        placeholder="Enter minimum lead time days"
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
              name="maxLeadTimeDays"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Maximum Lead Time Days</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        // pattern="[0-9]*[.,]?[0-9]*"
                        // title="Please enter positive number"
                        placeholder="Enter maximum lead time days"
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
              name="probability"
              render={({ field }) => {
                return (
                  <FormItem className="col-span-2 w-1/2">
                    <FormLabel>Forecast Probability</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        // pattern="[0-9]*[.,]?[0-9]*"
                        // title="Please enter positive number"
                        placeholder="Enter forecast probability"
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
