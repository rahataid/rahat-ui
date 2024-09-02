import { UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';

type IProps = {
  form: UseFormReturn<
    {
      title: string;
      isMandatory?: boolean | undefined;
    },
    any,
    undefined
  >;
};

export default function AddManualTriggerForm({ form }: IProps) {
  const selectedPhase = JSON.parse(
    localStorage.getItem('selectedPhase') as string,
  );

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
