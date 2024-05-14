import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@rahat-ui/shadcn/src/components/ui/dialog";
import { Button } from "@rahat-ui/shadcn/src/components/ui/button";
import { Input } from "@rahat-ui/shadcn/src/components/ui/input";
import { Pencil } from 'lucide-react';

export default function DHMBulletinDialog() {
    const FormSchema = z.object({
        waterWay: z.string().min(5, { message: 'Must be at least 5 characters' }),
        river: z.string().min(5, { message: 'Must be at least 5 characters' }),
        todayStatus: z.string().min(5, { message: 'Must be at least 5 characters' }),
        tomorrowStatus: z.string().min(5, { message: 'Must be at least 5 characters' }),
        dayAfterTomorrowStatus: z.string().min(5, { message: 'Must be at least 5 characters' }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            waterWay: '',
            river: '',
            todayStatus: '',
            tomorrowStatus: '',
            dayAfterTomorrowStatus: ''
        },
    });

    const handleUpdateBulletin = async (data: z.infer<typeof FormSchema>) => {
        alert('done')
        console.log('data::', data)
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="rounded-full border border-primary text-primary bg-card p-2 cursor-pointer">
                    <Pencil size={20} strokeWidth={1.5} />
                </div>
            </DialogTrigger>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleUpdateBulletin)}>
                        <DialogHeader>
                            <DialogTitle>Update Bulletin</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 grid gap-4">
                            <FormField
                                control={form.control}
                                name="waterWay"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Waterway</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter Waterway"
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
                                name="river"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>River</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter River"
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
                                name="todayStatus"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Today's status</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter status"
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
                                name="tomorrowStatus"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Tomorrow's status</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter status"
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
                                name="dayAfterTomorrowStatus"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>The day after tomorrow's status</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter status"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <div className="flex justify-between gap-2 mt-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="bg-red-100 text-red-600 w-full"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="w-full">Update</Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}