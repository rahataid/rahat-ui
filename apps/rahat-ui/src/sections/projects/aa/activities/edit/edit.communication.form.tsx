import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { useStakeholdersGroupsStore } from '@rahat-ui/query';
import { X } from 'lucide-react';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

type IProps = {
  form: any;
  onClose: VoidFunction;
  index: number;
};

export default function EditCommunicationForm({
  form,
  onClose,
  index,
}: IProps) {
  const stakeholdersGroups = useStakeholdersGroupsStore(
    (state) => state.stakeholdersGroups,
  );
  const fieldName = (name: string) => `activityCommunication.${index}.${name}`; // Dynamic field name generator
  return (
    <div className="border border-dashed rounded p-4 my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">Add : Communication</h1>
        <div className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 cursor-pointer">
          <X size={20} strokeWidth={3} onClick={onClose} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={fieldName('groupType')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="STAKEHOLDERS">Stakeholders</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={fieldName('groupId')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stakeholdersGroups.map((group: any) => (
                    <SelectItem key={group.id} value={group.uuid}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={fieldName('communicationType')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Communication Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select communication type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EMAIL">Email</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={fieldName('message')}
          render={({ field }) => {
            return (
              <FormItem className="col-span-2">
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Write message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="hidden">
          <FormField
            control={form.control}
            name={fieldName('campaignId')}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>CampaignId</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="campaignId" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}