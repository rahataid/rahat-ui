
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from "@rahat-ui/shadcn/src/components/ui/input";
import { Textarea } from "@rahat-ui/shadcn/src/components/ui/textarea";
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';

export default function EditActivityView() {
    const FormSchema = z.object({
        status: z.boolean(),
        note: z.string().min(2, { message: 'Note must be at least 4 character' }),
        picture: z.string().min(2, { message: 'Please select picture' })
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            status: false,
            note: '',
            picture: ''
        },
    });

    const handleEditActivity = (data: z.infer<typeof FormSchema>) => {
        console.log('Form Data:', data);
        alert('Updated!')
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditActivity)}>
                <div className="p-2 border rounded m-2 grid gap-4">
                    <h1 className='p-2 font-semibold bg-secondary'>Update Activity</h1>
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => {
                            return (
                                <div className='grid gap-2 pl-2'>
                                    <FormLabel>Status</FormLabel>
                                    <FormItem
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(checked) => field.onChange(checked)}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">
                                            Approve
                                        </FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                </div>
                            )
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="picture"
                        render={({ field }) => {
                            return (
                                <FormItem className='grid pl-2'>
                                    <FormLabel>Picture</FormLabel>
                                    <FormControl>
                                        <Input type="file" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => {
                            return (
                                <FormItem className="grid pl-2">
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea className='rounded' placeholder="Enter your notes..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <div className="flex justify-end">
                        <Button>Submit</Button>
                    </div>
                </div>
            </form>
        </Form >
    )
}