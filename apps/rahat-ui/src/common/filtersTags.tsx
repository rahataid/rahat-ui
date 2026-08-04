import { useTranslations } from 'next-intl';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import React from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import { format } from 'date-fns';
import {
  ScrollArea,
  ScrollBar,
} from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { IconLabelBtn } from './icon.label.btn';
import { Trash2, X } from 'lucide-react';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

const camelToUpperSnake = (key: string) =>
  key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase();

const FiltersTags = ({ filters, setFilters, total }: any) => {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const filterArray = Object.entries(filters).map(([key, value]) => {
    return { key, value };
  });

  const handleFilterArrayChange = (key: string, value: string) => {
    const { [key]: _, ...rest } = filters;
    setFilters(rest);
  };

  const formatFilterKey = (key: string) => {
    const translationKey = camelToUpperSnake(key) as any;
    if (t.has(translationKey)) return t(translationKey);
    if (tg.has(translationKey)) return tg(translationKey);
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const formatFilterValue = (value: unknown) => {
    const str = String(value);
    if (str === 'true') return tg('YES');
    if (str === 'false') return tg('NO');
    const translationKey = str.toUpperCase() as any;
    if (t.has(translationKey)) return t(translationKey);
    if (tg.has(translationKey)) return tg(translationKey);
    return str;
  };

  return (
    <div className="rounded bg-card  px-4 text-sm mb-2">
      <div className="flex items-center gap-6 w-full">
        <p className="text-primary min-w-max">
          {t('RESULTS_FOUND', { total: formatNum(total) })}
        </p>
        <ScrollArea className="w-full py-2">
          <div className="flex gap-4 items-center">
            {filterArray.map((filter, index) => (
              <div className="flex items-center gap-2" key={index}>
                {formatFilterKey(filter.key)}:{' '}
                <span
                  onClick={() =>
                    handleFilterArrayChange(filter.key, filter.value as string)
                  }
                  className="cursor-pointer bg-gray-200 py-2 px-2 text-slate-700 rounded-xl text-xs flex items-center gap-2"
                >
                  {formatFilterValue(filter.value)}
                  <X className="w-4 h-4 text-red-600" />
                </span>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {/* <Button onClick={() => setFilters({})}>Clear filter</Button> */}
        <IconLabelBtn
          Icon={Trash2}
          name={t('CLEAR')}
          handleClick={() => setFilters({})}
          variant="outline"
          className="text-red-500 rounded-xl"
        />
      </div>
    </div>
  );
};

export default FiltersTags;
