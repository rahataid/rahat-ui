import * as React from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    useAAStationsStore,
    useActivitiesStore,
    useActivitiesHazardTypes,
    useCreateTriggerStatement,
    useActivities,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel,
    SelectGroup
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { UUID } from 'crypto';
import { Plus, X } from 'lucide-react';

export default function AddAutomatedTriggerForm() {
    const [phase, setPhase] = React.useState('');
    const params = useParams();
    const createTriggerStatement = useCreateTriggerStatement();
    const projectID = params.id as UUID;
    useActivities(projectID, {});
    const activities = useActivitiesStore((state) => state.activities);
    const dhmStations = useAAStationsStore(
        (state) => state.dhmStations![projectID],
    );

    // TODO: refactor to searchable select
    const stations = [...dhmStations.results.slice(0, 5), { title: 'Karnali at Chisapani' }]

    useActivitiesHazardTypes(projectID);
    const hazardTypes = useActivitiesStore((state) => state.hazardTypes);

    const FormSchema = z.object({
        triggerTitle: z.string().optional(),
        source: z.string().optional(),
        riverBasin: z.string().optional(),
        hazardType: z.string().optional(),
        phase: z.string().min(1, { message: "Please select phase" }),
        // readinessLevel: z.string().regex(/^(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)$/, "Must be a positive integer or a decimal number").optional(),
        // activationLevel: z.string().regex(/^(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)$/, "Must be a positive integer or a decimal number").optional(),
        readinessLevel: z.string().optional(),
        activationLevel: z.string().optional(),
        activity: z.array(z.object({
            uuid: z.string(),
            title: z.string()
        })).refine((value) => value.length > 0 && value.every(item => item.uuid && item.title), {
            message: "You have to select at least one activity",
        }),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            triggerTitle: '',
            source: '',
            riverBasin: '',
            hazardType: '',
            phase: '',
            readinessLevel: '',
            activationLevel: '',
            activity: [],
        },
    });

    const handleCreateTriggerStatement = async (data: z.infer<typeof FormSchema>) => {
        console.log('data::', data)
        alert('submitted')
        setPhase('')
        form.reset();
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateTriggerStatement)}>
                    <div className="mt-4 grid gap-4">
                        <div className='w-full flex gap-4'>
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
                                name="source"
                                render={({ field }) => {
                                    return (
                                        <FormItem className='w-full'>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormLabel>Source</FormLabel>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Source" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={'DHM'}>
                                                        Department of Hydrology and Meteorology (DHM)
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>
                        <div className='w-full flex gap-4'>
                            <FormField
                                control={form.control}
                                name="riverBasin"
                                render={({ field }) => {
                                    return (
                                        <FormItem className='w-full'>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormLabel>River Basin</FormLabel>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select River Basin" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {stations?.map((r: any) => {
                                                        return (
                                                            <SelectItem key={r.id} value={r.title}>
                                                                {r.title}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="hazardType"
                                render={({ field }) => {
                                    return (
                                        <FormItem className='w-full'>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormLabel>Hazard Type</FormLabel>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Hazard Type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {hazardTypes?.map((d: any) => {
                                                        return (
                                                            <SelectItem key={d.id} value={d.uuid}>
                                                                {d.name}
                                                            </SelectItem>
                                                        );
                                                    })}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="phase"
                            render={({ field }) => {
                                return (
                                    <FormItem className='w-full'>
                                        <Select
                                            onValueChange={(value) => {
                                                setPhase(value);
                                                field.onChange(value);
                                            }}
                                            defaultValue={field.value}
                                        >
                                            <FormLabel>Phase</FormLabel>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Phase" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='readiness'>Readiness</SelectItem>
                                                <SelectItem value='activation' >Activation</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        {phase === 'readiness' && (
                            <FormField
                                control={form.control}
                                name="readinessLevel"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Readiness Level</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Enter Readiness Level' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        )}
                        {phase === 'activation' && (
                            <FormField
                                control={form.control}
                                name="activationLevel"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Activation Level</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Enter Activation Level' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="activity"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <Select
                                            onValueChange={field.onChange}
                                        // defaultValue={field.value}
                                        >
                                            <FormLabel>Activity</FormLabel>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Activity" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel className='text-primary flex items-center gap-1 p-2 bg-secondary'>Add new activity <Plus size={18} /></SelectLabel>
                                                    {activities.map((item: any) => (
                                                        <FormField
                                                            key={item.id}
                                                            control={form.control}
                                                            name="activity"
                                                            render={({ field }) => {
                                                                return (
                                                                    <FormItem
                                                                        key={item.id}
                                                                        className="flex flex-row items-start space-x-3 space-y-0 mx-1 my-2"
                                                                    >
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value?.some(value => value.uuid === item.uuid)}
                                                                                onCheckedChange={(checked) => {
                                                                                    return checked
                                                                                        ? field.onChange([...field.value, { uuid: item.uuid, title: item.title }])
                                                                                        : field.onChange(
                                                                                            field.value?.filter(
                                                                                                (value) => value.uuid !== item.uuid
                                                                                            )
                                                                                        )
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel className="text-sm font-normal">
                                                                            {item.title}
                                                                        </FormLabel>
                                                                    </FormItem>
                                                                )
                                                            }}
                                                        />
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <div className='flex flex-wrap gap-2 mt-2'>
                                            {form.watch('activity').map((activity) => {
                                                const truncatedTitle = activity.title.length > 15 ? activity.title.slice(0, 14) + "..." : activity.title;
                                                return (
                                                    <div key={activity.uuid} className='px-2 py-1 flex gap-2 items-center bg-secondary rounded'>
                                                        <p className='text-primary'>{truncatedTitle}</p>
                                                        <X
                                                            className='cursor-pointer hover:text-red-500 ml-4'
                                                            onClick={() => {
                                                                const updatedValue = field.value?.filter(value =>
                                                                    value.uuid !== activity.uuid
                                                                );
                                                                field.onChange(updatedValue);
                                                            }}
                                                            size={18}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </div>
                    <div className="flex justify-end mt-8">
                        <div className='flex gap-2'>
                            <Button
                                type='button'
                                variant='secondary'
                                className='bg-red-100 text-red-600 w-36'
                                onClick={() => {
                                    form.reset();
                                    setPhase('')
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type='submit'>Add Trigger Statement</Button>
                        </div>
                    </div>
                </form>
            </Form >
        </>
    );
}
