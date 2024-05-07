import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
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

export default function AddManualTriggerForm() {
    const FormSchema = z.object({
        triggerTitle: z.string().optional(),
        triggerNotes: z.string().optional(),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            triggerTitle: '',
            triggerNotes: '',
        },
    });

    const handleCreateTriggerStatement = async (data: z.infer<typeof FormSchema>) => {
        alert('submitted')
        form.reset();
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateTriggerStatement)}>
                    <div className="mt-4 grid gap-4">
                        <FormField
                            control={form.control}
                            name="triggerTitle"
                            render={({ field }) => {
                                return (
                                    <FormItem className='w-full'>
                                        <FormLabel>Trigger Title</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Enter Trigger Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="triggerNotes"
                            render={({ field }) => {
                                return (
                                    <FormItem className='w-full'>
                                        <FormLabel>Trigger Title</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter Trigger Notes" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </div>
                    <div className="flex justify-end mt-8">
                        <div className='flex gap-2'>
                            <Button type='button' variant='secondary' className='bg-red-100 text-red-600 w-36'>Cancel</Button>
                            <Button type='submit'>Add Trigger Statement</Button>
                        </div>
                    </div>
                </form>
            </Form >
        </>
    );
}
