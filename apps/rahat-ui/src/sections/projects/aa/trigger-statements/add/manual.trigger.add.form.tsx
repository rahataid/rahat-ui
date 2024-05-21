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
import { useActivitiesStore } from '@rahat-ui/query';

type IProps = {
  form: UseFormReturn<
    {
      title: string;
      hazardTypeId: string;
    },
    any,
    undefined
  >;
};

export default function AddManualTriggerForm({ form }: IProps) {
  const selectedPhase = JSON.parse(
    localStorage.getItem('selectedPhase') as string,
  );
  const { hazardTypes } = useActivitiesStore((state) => ({
    hazardTypes: state.hazardTypes,
  }));

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
              name="hazardTypeId"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormLabel>Hazard Type</FormLabel>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Hazard Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hazardTypes?.map((d: any) => {
                          return (
                            <SelectItem key={d.id} value={d.uuid}>
                              {d.name}
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
        </form>
      </Form>
    </>
  );
}
