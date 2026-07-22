import { useTranslations } from 'next-intl';
import { Table } from "@tanstack/react-table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Button } from "@rahat-ui/shadcn/src/components/ui/button";

type IProps = {
    table: Table<any>
}

export default function ClientSidePagination({ table }: IProps) {
    const t = useTranslations('GLOBAL');
    return (
        <div className="flex items-center justify-end space-x-8 border-t px-4 py-2">
            <div className="flex items-center gap-2">
                <div className="text-sm font-medium">{t('ROWS_PER_PAGE')}</div>
                <Select
                    defaultValue="10"
                    onValueChange={(value) => table.setPageSize(Number(value))}
                >
                    <SelectTrigger className="w-16">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                            <SelectItem value="40">40</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div>
                {t('PAGE')} {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
            </div>
            <div className="space-x-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {t('PREVIOUS')}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {t('NEXT')}
                </Button>
            </div>
        </div>
    )
}