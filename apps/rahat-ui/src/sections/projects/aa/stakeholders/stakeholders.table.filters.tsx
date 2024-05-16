import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Search } from 'lucide-react';
import { UUID } from 'crypto';
import AddButton from '../../components/add.btn';

type IProps = {
    handleFilter: VoidFunction;
    projectID: UUID;
}

export default function StakeholdersTableFilters({ handleFilter, projectID }: IProps) {
    return (
        <div className="flex items-center gap-2 mb-2">
            <div className="relative w-full">
                <Search size={18} strokeWidth={2.5} className="absolute left-2 top-3 text-muted-foreground" />
                <Input
                    type='text'
                    placeholder="Search Stakeholders..."
                    className="rounded-l rounded-r-none pl-8"
                />
            </div>
            {/* Add Stakeholders Btn */}
            <AddButton path={`/projects/aa/${projectID}/stakeholders/add`} name='Stakeholder' />
        </div>
    )
}