import * as React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
} from '@rahat-ui/shadcn/components/select';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Search } from 'lucide-react';
import { useActivitiesStore } from '@rahat-ui/query';
import AddButton from '../../components/add.btn';
import { UUID } from 'crypto';

type IProps = {
    handleFilter: (key: string, value: string) => void;
    projectID: UUID;
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    activity: string;
    phase: string;
    category: string;
    hazardType: string
}

export default function ActivitiesTableFilters({ handleFilter, projectID, handleSearch, activity, phase, category, hazardType }: IProps) {
    const { categories, phases, hazardTypes } = useActivitiesStore((state) => ({
        categories: state.categories,
        phases: state.phases,
        hazardTypes: state.hazardTypes
    }));

    return (
        <div className="flex items-center gap-2 mb-2">
            <div className="relative w-full">
                <Search size={18} strokeWidth={2.5} className="absolute left-2 top-3 text-muted-foreground" />
                <Input
                    type='text'
                    placeholder="Search Activities..."
                    className="pl-8"
                    value={activity}
                    onChange={handleSearch}
                />
            </div>
            {/* Filter Phases */}
            <Select value={phase} onValueChange={(value) => handleFilter("phase", value)}>
                <SelectTrigger className={phase ? "" : 'text-muted-foreground'}>
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
            <Select value={category} onValueChange={(value) => handleFilter("category", value)}>
                <SelectTrigger className={category ? "" : "text-muted-foreground"}>
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
            <Select value={hazardType} onValueChange={(value) => handleFilter("hazardType", value)}>
                <SelectTrigger className={hazardType ? "" : "text-muted-foreground"}>
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
            <AddButton path={`/projects/aa/${projectID}/activities/add`} name='Activities' />
        </div>
    )
}