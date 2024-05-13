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


export default function AddCommunicationForm({ form }: any) {
    const stakeholdersGroups = useStakeholdersGroupsStore((state) => state.stakeholdersGroups)
    return (
        <div className='border border-dashed rounded p-4'>
            <h1 className="text-lg font-semibold mb-6">Add : Communication</h1>
            <div className='grid grid-cols-2 gap-4'>
                <FormField
                    control={form.control}
                    name="groupType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Group Type</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
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
                    name="groupId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Group</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select group" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {stakeholdersGroups.map((group: any) => (
                                        <SelectItem key={group.id} value={group.uuid}>{group.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="communicationType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Communication Type</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
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
                    name="message"
                    render={({ field }) => {
                        return (
                            <FormItem className='col-span-2'>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Write message" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
            </div>
        </div>
    )
}