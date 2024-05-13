import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
} from '@rahat-ui/shadcn/components/select';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { useActivitiesStore } from '@rahat-ui/query';

type IProps = {
    handleFilter: (key: string, value: string) => void;
    projectID: string | string[];
}

export default function ActivitiesTableFilters({ handleFilter, projectID }: IProps) {
    const { categories, phases, hazardTypes } = useActivitiesStore((state) => ({
        categories: state.categories,
        phases: state.phases,
        hazardTypes: state.hazardTypes
    }));

    const router = useRouter();

    return (
        <div className="flex items-center gap-2 mb-2">
            <div className="relative w-full">
                <Search size={18} strokeWidth={2.5} className="absolute left-2 top-3 text-muted-foreground" />
                <Input
                    type='text'
                    placeholder="Search Activities..."
                    className="rounded-l rounded-r-none pl-8"
                />
            </div>
            {/* Filter Phases */}
            <Select onValueChange={(value) => handleFilter("phase", value)}>
                <SelectTrigger className='text-muted-foreground'>
                    <SelectValue placeholder="Select a phase" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value='all'>
                            All Phases
                        </SelectItem>
                        {phases.map((item) => (
                            <SelectItem key={item.id} value={item.uuid}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            {/* Filter Category */}
            <Select onValueChange={(value) => handleFilter("category", value)}>
                <SelectTrigger className='text-muted-foreground'>
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value='all'>
                            All Categories
                        </SelectItem>
                        {categories.map((item) => (
                            <SelectItem key={item.id} value={item.uuid}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            {/* Filter Hazard type */}
            <Select onValueChange={(value) => handleFilter("hazardType", value)}>
                <SelectTrigger className='text-muted-foreground'>
                    <SelectValue placeholder="Select a hazard type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {hazardTypes.map((item) => (
                            <SelectItem key={item.id} value={item.uuid}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            {/* Add Activities Btn */}
            <Button type='button' onClick={() => router.push(`/projects/aa/${projectID}/activities/add`)}><Plus size={18} className='mr-1' /> Add Activities</Button>
        </div>
    )
}