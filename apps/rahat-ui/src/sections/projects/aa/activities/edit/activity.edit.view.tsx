import * as React from 'react'
import { useParams } from 'next/navigation';
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
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Plus, CloudUpload, Check, X, LoaderCircle } from 'lucide-react';
import {
    useActivitiesStore,
    useStakeholdersGroups,
    useUploadFile,
    useSingleActivity
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import AddCommunicationForm from '../add/add.communication.form';
import Loader from 'apps/rahat-ui/src/components/table.loader';

export default function EditActivity() {
    const uploadFile = useUploadFile();
    const { id: projectID, activityID } = useParams();
    const { data: activityDetail, isLoading } = useSingleActivity(projectID as UUID, activityID);

    const [communicationFormOpened, setCommunicationFormOpened] = React.useState<boolean>(false)

    const FormSchema = z.object({
        title: z.string().min(2, { message: 'Title must be at least 4 character' }),
        responsibility: z.string().min(2, { message: 'Please enter responsibility' }),
        source: z.string().min(2, { message: 'Please enter source' }),
        phaseId: z.string().min(1, { message: 'Please select phase' }),
        categoryId: z.string().min(1, { message: 'Please select category' }),
        hazardTypeId: z.string().min(1, { message: 'Please select hazard type' }),
        leadTime: z.string().min(2, { message: "Please enter lead time" }),
        description: z.string().min(5, { message: 'Must be at least 5 characters' }),
        activityDocuments: z.array(z.object({
            mediaURL: z.string(),
            fileName: z.string()
        })).optional(),
        activityCommunication: communicationFormOpened
            ? z.array(
                z.object({
                    groupType: z.string().min(1, { message: 'Please select group type' }),
                    groupId: z.string().min(1, { message: 'Please select group' }),
                    communicationType: z.string().min(1, { message: 'Please select communication type' }),
                    message: z.string().min(5, { message: 'Must be at least 5 characters' })
                })
            ).refine(
                (val) => val.length > 0,
                { message: 'Please add at least one communication' }
            )
            : z.array(z.object({
                groupType: z.string().optional(),
                groupId: z.string().optional(),
                communicationType: z.string().optional(),
                message: z.string().optional()
            }))
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: activityDetail?.title,
            responsibility: activityDetail?.responsibility,
            source: activityDetail?.source,
            phaseId: activityDetail?.phaseId,
            categoryId: activityDetail?.categoryId,
            hazardTypeId: activityDetail?.hazardTypeId,
            leadTime: activityDetail?.leadTime,
            description: activityDetail?.description,
            activityDocuments: activityDetail?.activityDocuments,
            activityCommunication: activityDetail?.activityCommunication
        },
    });

    const prevDocuments = activityDetail?.activityDocuments?.map((d: any, index: number) => ({ id: index, name: d.fileName }));
    const prevCommunications = activityDetail?.activityCommunication?.map((c: any, index: number) =>
        ({ id: index, form: <AddCommunicationForm key={index} form={form} index={index} onClose={() => removeCommunicationForm(index)} /> }))

    const { categories, phases, hazardTypes } = useActivitiesStore((state) => ({
        categories: state.categories,
        phases: state.phases,
        hazardTypes: state.hazardTypes
    }))

    const [documents, setDocuments] = React.useState<{ id: number, name: string }[]>(prevDocuments);
    const [allFiles, setAllFiles] = React.useState<{ mediaURL: string, fileName: string }[]>(activityDetail?.activityDocuments);
    const [communicationAddForm, setCommunicationAddForm] = React.useState<{ id: number; form: React.ReactNode }[]>(prevCommunications);
    const nextId = React.useRef(0);

    useStakeholdersGroups(projectID as UUID, {})

    const removeCommunicationForm = (idToRemove: number) => {
        setCommunicationAddForm(prevForms => prevForms.filter(({ id }) => id !== idToRemove));
        if (communicationAddForm.length < 1) {
            setCommunicationFormOpened(false);
            form.setValue('activityCommunication', [])
        }
    };

    const addCommunicationForm = () => {
        setCommunicationFormOpened(true);
        const newId = nextId.current++;
        setCommunicationAddForm(prevForms => [...prevForms, { id: newId, form: <AddCommunicationForm key={newId} form={form} index={newId} onClose={() => removeCommunicationForm(newId)} /> }]);
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const newId = nextId.current++;
            setDocuments(prev => [...prev, { id: newId, name: file.name }])
            const formData = new FormData();
            formData.append('file', file);
            const { data: afterUpload } = await uploadFile.mutateAsync(formData);
            setAllFiles(prev => [...prev, afterUpload])
        }
    }

    React.useEffect(() => {
        form.setValue('activityDocuments', allFiles)
    }, [allFiles, setAllFiles])

    const handleUpdateActivity = async (data: z.infer<typeof FormSchema>) => {
        // try {
        //     await createActivity.mutateAsync({
        //         projectUUID: projectID as UUID,
        //         activityPayload: data,
        //     });
        // } catch (e) {
        //     console.error('Error::', e);
        // } finally {
        //     form.reset();
        //     setCommunicationAddForm([]);
        //     setCommunicationFormOpened(false);
        //     setAllFiles([]);
        //     setDocuments([]);
        // }
        console.log('data::', data)
    };

    if (isLoading) return <Loader />
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateActivity)}>
                <div className='p-2 bg-secondary'>
                    <ScrollArea className='h-[calc(100vh-80px)]'>
                        <div className="p-4 rounded bg-card">
                            <h1 className="text-lg font-semibold mb-6">Edit : Activity</h1>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className='col-span-2'>
                                                <FormLabel>Activity title</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter activity title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                                <FormField
                                    control={form.control}
                                    name="responsibility"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Responsibility</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter responsibility"
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
                                    name="source"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Source</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter source" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                                <FormField
                                    control={form.control}
                                    name="phaseId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phase</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select phase" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {phases.map((item) => (
                                                        <SelectItem key={item.id} value={item.uuid}>
                                                            {item.name}
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
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((item) => (
                                                        <SelectItem key={item.id} value={item.uuid}>
                                                            {item.name}
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
                                    name="hazardTypeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hazard Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select hazard type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {hazardTypes.map((item) => (
                                                        <SelectItem key={item.id} value={item.uuid}>
                                                            {item.name}
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
                                    name="leadTime"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Lead Time</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Enter lead time" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className='col-span-2'>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Enter description" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="activityDocuments"
                                render={({ field }) => {
                                    return (
                                        <FormItem className='mt-4'>
                                            <FormControl>
                                                <div className='relative border border-dashed rounded p-1.5'>
                                                    <div className='absolute inset-0 flex gap-2 items-center justify-center'>
                                                        <CloudUpload size={25} strokeWidth={2} className='text-primary' />
                                                        <p className='text-sm font-medium'>Drop files to upload, or <span className='text-primary cursor-pointer'>browse</span></p>
                                                    </div>
                                                    <Input
                                                        className='opacity-0'
                                                        type='file'
                                                        onChange={handleFileChange}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                            {documents?.map((file) => (
                                                <div key={file.name} className='flex justify-between items-center'>
                                                    <p className='text-sm flex gap-2 items-center'>
                                                        {
                                                            uploadFile.isPending && documents?.[documents?.length - 1].name === file.name
                                                                ? <LoaderCircle size={16} strokeWidth={2.5} className='text-green-600 animate-spin' />
                                                                : <Check size={16} strokeWidth={2.5} className='text-green-600' />
                                                        }
                                                        {file.name}
                                                    </p>
                                                    <div className='p-0.5 rounded-full border-2 hover:border-red-500 text-muted-foreground  hover:text-red-500 cursor-pointer'>
                                                        <X
                                                            size={16}
                                                            strokeWidth={2.5}
                                                            onClick={() => {
                                                                const newDocuments = documents?.filter((doc) => doc.name !== file.name)
                                                                setDocuments(newDocuments);
                                                                const newFiles = allFiles.filter((f, index) => index !== file.id);
                                                                setAllFiles(newFiles);
                                                            }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </FormItem>
                                    );
                                }}
                            />
                            {communicationAddForm?.map(({ id, form }) => (
                                <div key={id} className='mt-4'>{form}</div>
                            ))}
                            <Button
                                type='button'
                                variant='outline'
                                className='border-dashed border-primary text-primary text-md w-full mt-4'
                                onClick={addCommunicationForm}
                            >
                                Add Communication
                                <Plus className='ml-2' size={16} strokeWidth={3} />
                            </Button>
                            <Button type='button' variant='outline' className='border-dashed border-primary text-primary text-md w-full mt-4'>
                                Add Payout
                                <Plus className='ml-2' size={16} strokeWidth={3} />
                            </Button>
                            <div className="flex justify-end mt-8">
                                <div className='flex gap-2'>
                                    <Button
                                        type='button'
                                        variant='secondary'
                                        className='bg-red-100 text-red-600 w-36'
                                        onClick={() => {
                                            form.reset();
                                            setCommunicationAddForm([]);
                                            setCommunicationFormOpened(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type='submit' >Update Activity</Button>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </form>
        </Form>
    );
}
