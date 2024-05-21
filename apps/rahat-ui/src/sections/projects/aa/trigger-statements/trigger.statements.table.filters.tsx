import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Button } from '@rahat-ui/shadcn/components/button';
import AddButton from '../../components/add.btn';
import { Settings2, Search } from 'lucide-react';
import { UUID } from "crypto";
import { Table } from '@tanstack/react-table';

type IProps = {
    handleSearch: VoidFunction
    projectId: UUID
    table: Table<any>
}

export default function TriggerStatementsTableFilters({ handleSearch, projectId, table }: IProps) {
    return (
        <div className="flex items-center mb-2 gap-4">
            <div className="flex w-full">
                <div className="relative w-full">
                    <Search
                        size={18}
                        strokeWidth={2.5}
                        className="absolute left-2 top-3 text-muted-foreground"
                    />
                    <Input
                        placeholder="Search Trigger Statements..."
                        className="rounded-l rounded-r-none pl-8"
                        onChange={handleSearch}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" className="rounded-l-none border">
                            <Settings2 className="mr-2 h-4 w-5" />
                            View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
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
            </div>
            {/* Add Trigger Statements Btn */}
            <AddButton path={`/projects/aa/${projectId}/trigger-statements/add`} name='Trigger Statement' />
        </div>
    )
}