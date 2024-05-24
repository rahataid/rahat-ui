import * as React from 'react';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Search } from 'lucide-react';
import { UUID } from 'crypto';
import AddButton from '../../components/add.btn';

type IHandleSearch = (event: React.ChangeEvent<HTMLInputElement>, key: string) => void;

type IProps = {
    handleSearch: IHandleSearch
    projectID: UUID
    stakeholder: string
    municipality: string
    organization: string
}

const SearchInput = ({ name, value, handleSearch }: { name: string, value: string, handleSearch: IHandleSearch }) => (
    <div className="relative w-full">
        <Search size={18} strokeWidth={2.5} className="absolute left-2 top-3 text-muted-foreground" />
        <Input
            type='text'
            placeholder={`Search ${name}...`}
            className="pl-8"
            value={value}
            onChange={(e) => handleSearch(e, name)}
        />
    </div>
)

export default function StakeholdersTableFilters({ handleSearch, projectID, stakeholder, municipality, organization }: IProps) {
    return (
        <div className="flex items-center gap-2 mb-2">
            {/* Search Stakeholder */}
            <SearchInput name='name' value={stakeholder} handleSearch={handleSearch} />

            {/* Search Organization */}
            <SearchInput name='organization' value={organization} handleSearch={handleSearch} />

            {/* Search Municipality */}
            <SearchInput name='municipality' value={municipality} handleSearch={handleSearch} />

            {/* Add Stakeholders Btn */}
            <AddButton path={`/projects/aa/${projectID}/stakeholders/add`} name='Stakeholder' />
        </div>
    )
}