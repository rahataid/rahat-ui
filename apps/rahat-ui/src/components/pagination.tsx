import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
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
  const formatNum = useNumberFormat();
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
              {['5', '10', '20', '30', '40', '50'].map((s) => (
                <SelectItem key={s} value={s}>
                  {formatNum(s)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="text-sm ">
        {t('PAGE_CURRENT_OF_TOTAL', {
          current: formatNum(pageIndex + 1),
          total: formatNum(pageCount),
        })}
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
