import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
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

type IProps = {
  form: UseFormReturn<{
    title: string;
    source: string;
    isMandatory?: boolean;
    minLeadTimeDays: string;
    maxLeadTimeDays: string;
    probability: string;
    notes?: string;
  }>;
  phase: any;
};

export default function AddAutomatedTriggerForm({ form, phase }: IProps) {
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormLabel>Source</FormLabel>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DHM">DHM</SelectItem>
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
