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
import { Textarea } from "@rahat-ui/shadcn/src/components/ui/textarea";
import { X, CloudUpload, Check } from 'lucide-react';

export default function ManualTriggerDialog() {
    const [documents, setDocuments] = React.useState<{ id: number, name: string }[]>([])
    const nextId = React.useRef(0);

    const FormSchema = z.object({
        note: z.string().min(5, { message: 'Must be at least 5 characters' }),
        document: z
            .instanceof(File) // Validate that the input is a File object
            .refine((file) => file.size < 1024 * 1024, {
                message: "File size must be less than 1MB",
            }), // Example constraint: File size must be less than 1MB
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            note: '',
            document: undefined

        },
    });

    const handleTriggerSubmit = async (data: z.infer<typeof FormSchema>) => {
        alert('done')
        console.log('data::', data)
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" className="px-8">
                    Trigger
                </Button>
            </DialogTrigger>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleTriggerSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Trigger</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 grid gap-4">
                            <FormField
                                control={form.control}
                                name="note"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Add note</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Write note"
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
                                name="document"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormControl>
                                                <div className='relative border border-dashed rounded p-1.5'>
                                                    <div className='absolute inset-0 flex gap-2 items-center justify-center'>
                                                        <CloudUpload size={25} strokeWidth={2} className='text-primary' />
                                                        <p className='text-sm font-medium'>Drop files to upload, or <span className='text-primary cursor-pointer'>browse</span></p>
                                                    </div>
                                                    <Input
                                                        className='opacity-0'
                                                        type='file'
                                                        onChange={(e) => {
                                                            const files = e.target.files;
                                                            if (files && files.length > 0) {
                                                                const file = files[0];
                                                                form.setValue('document', file);
                                                                const newId = nextId.current++;
                                                                setDocuments(prev => [...prev, { id: newId, name: file.name }])
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                            {documents?.map((file) => (
                                                <div key={file.id} className='flex justify-between items-center'>
                                                    <p className='text-sm flex gap-2 items-center'><Check size={16} strokeWidth={2.5} className='text-green-600' />{file.name}</p>
                                                    <div className='p-0.5 rounded-full border-2 hover:border-red-500 text-muted-foreground  hover:text-red-500 cursor-pointer'>
                                                        <X
                                                            size={16}
                                                            strokeWidth={2.5}
                                                            onClick={() => {
                                                                const newDocuments = documents?.filter((doc) => doc.id !== file.id)
                                                                setDocuments(newDocuments)
                                                            }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </FormItem>
                                    );
                                }}
                            />
                            <div className="flex justify-between gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="bg-red-100 text-red-600 w-full"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="w-full">Submit</Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}