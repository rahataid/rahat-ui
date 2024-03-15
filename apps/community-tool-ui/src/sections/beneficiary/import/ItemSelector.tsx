import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import React from 'react';

export default function ItemSelector({
  placeholder = '--Select Item--',
  form,
  handleItemChange,
  id,
  options,
}: any) {
  return (
    <div>
      <Form {...form}>
        <FormField
          control={form.control}
          name={id}
          render={({ field }) => {
            return (
              <FormItem>
                <Select
                  onValueChange={handleItemChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.map((item: any) => {
                      return (
                        <SelectItem value={item.value}>{item.label}</SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormItem>
            );
          }}
        />
      </Form>
    </div>
  );
}
