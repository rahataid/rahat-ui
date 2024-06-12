import { Table } from '@tanstack/react-table';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import SearchInput from "../../components/search.input";
import AddButton from '../../components/add.btn';
import { ChevronDown } from 'lucide-react';
import { UUID } from 'crypto';

type IProps = {
    table: Table<any>
    projectId: UUID
}

export default function TableFilter({ table, projectId }: IProps) {
    return (
        <div className="flex items-center gap-2 mb-2">
            <SearchInput
                className='w-full'
                name="Fund Management"
                value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
                onSearch={(event) =>
                    table.getColumn('title')?.setFilterValue(event.target.value)
                } />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                        Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            );
                        })}
                </DropdownMenuContent>
            </DropdownMenu>
            <AddButton
                name="Fund Reservation"
                path={`/projects/aa/${projectId}/fund-management/add`}
            />
        </div>
    )
}