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
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { DurationData } from '../../activities/add/add.activity.view';

type IProps = {
  form: UseFormReturn<{
    title: string;
    isMandatory?: boolean;
    description?: string;
    leadTime?: string;
  }>;
  phase: any;
  stationHeading?: string;
};

export default function AddManualTriggerForm({
  form,
  phase,
  stationHeading,
}: IProps) {
  return (
    <>
      <Form {...form}>
        <form>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormItem className="w-full">
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
              <FormLabel>{stationHeading}</FormLabel>
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
                  <FormItem
                    className={
                      phase?.isRequiredLeadTime ? 'w-full' : 'col-span-2 w-full'
                    }
                  >
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
            {phase?.isRequiredLeadTime && (
              <FormField
                control={form.control}
                name="leadTime"
                render={({ field }) => {
                  console.log('field.value', field.value);
                  const [lead, unitValue] = field.value?.split(' ') ?? ['', ''];
                  const unit = !unitValue ? 'days' : unitValue;
                  console.log('lead', lead, 'unit', unit);
                  return (
                    <FormItem className="w-full">
                      <FormLabel>Lead Time</FormLabel>
                      <div className="grid grid-cols-4">
                        <Input
                          type="text"
                          placeholder="Enter lead time"
                          className="col-span-3 rounded-r-none"
                          value={lead}
                          onChange={(e) => {
                            const newLead = e.target.value;
                            field.onChange(
                              newLead ? `${newLead} ${unit}` : ` ${unit}`,
                            );
                          }}
                        />
                        <Select
                          value={unit}
                          onValueChange={(val) => {
                            field.onChange(lead ? `${lead} ${val}` : ` ${val}`);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-l-none">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DurationData.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem className="col-span-2">
                    <FormLabel>Trigger Description</FormLabel>
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
