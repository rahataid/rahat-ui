import { useTranslations } from 'next-intl';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';

type IPagination = {
  pageIndex: number;
  pageCount: number;
  setPageSize: any;
  canPreviousPage: boolean;
  previousPage: () => void;
  canNextPage: boolean;
  nextPage: () => void;
};

const Pagination = ({
  pageIndex,
  pageCount,
  setPageSize,
  canPreviousPage,
  previousPage,
  canNextPage,
  nextPage,
}: IPagination) => {
  const t = useTranslations('GLOBAL');
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium">{t('ROWS_PER_PAGE')}</div>
        <Select
          defaultValue="10"
          onValueChange={(value) => setPageSize(Number(value))}
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
      <div className="text-sm ">
        {t('PAGE')} {pageIndex + 1} of {pageCount}
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={previousPage}
          disabled={!canPreviousPage}
        >
          {t('PREVIOUS')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={!canNextPage}
        >
          {t('NEXT')}
        </Button>
      </div>
    </div>
  );
};
export default Pagination;
