import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

import { isValidPhoneNumber } from 'react-phone-number-input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';

export default function AddStakeholders() {
    const FormSchema = z.object({
        phone: z.string().refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
        email: z.string().min(2, { message: 'Please enter email address.' }),
        designation: z.string().min(2, { message: 'Please enter designation.' }),
        organization: z.string().min(2, { message: 'Please enter organization.' }),
        district: z.string().min(2, { message: 'Please enter district.' }),
        municipality: z.string().min(2, { message: 'Please enter municipality' }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            phone: '',
            email: '',
            designation: '',
            organization: '',
            district: '',
            municipality: '',
        },
    });

    const handleCreateStakeholders = async (data: z.infer<typeof FormSchema>) => {
        form.reset();
        console.log('Add Stakeholders Data::', data);
        alert('Added Stakeholders');
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateStakeholders)}>
                <div className="p-4 h-add bg-card">
                    <h1 className="text-lg font-semibold mb-6">Add : Stakeholders</h1>
                    <div className="shadow-md p-4 rounded-sm">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormControl>
                                                <PhoneInput placeholder="Phone" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormControl>
                                                <Input type='email' placeholder="Email Address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="designation"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="text" placeholder="Designation" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="organization"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="text" placeholder="Organization" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="district"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="text" placeholder="District" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="municipality"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="text" placeholder="Municipality" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button>Create Stakeholders</Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
