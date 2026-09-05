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
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

// Maps known filter keys to their GLOBAL translation key. Keys not listed
// here (used by other, not-yet-translated FiltersTags consumers) fall back
// to the capitalized raw key so their behavior is unchanged.
const FILTER_KEY_LABELS: Record<string, string> = {
  status: 'STATUS',
  category: 'CATEGORY',
  title: 'TITLE',
  activity: 'TITLE',
  responsibility: 'RESPONSIBILITY',
  name: 'NAME',
};

const FiltersTags = ({ filters, setFilters, total }: any) => {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const filterArray = Object.entries(filters).map(([key, value]) => {
    return { key, value };
  });

  const getFilterLabel = (key: string) => {
    const labelKey = FILTER_KEY_LABELS[key];
    return labelKey && tg.has(labelKey)
      ? tg(labelKey)
      : key.charAt(0).toUpperCase() + key.slice(1);
  };

  const getFilterValueLabel = (key: string, value: unknown) => {
    if (value === true || value === 'true') return tg('TRUE');
    if (value === false || value === 'false') return tg('FALSE');
    if (key === 'status') {
      return translateValue(tg, value, { fallback: String(value ?? '') });
    }
    return String(value ?? '');
  };

  const handleFilterArrayChange = (key: string, value: string) => {
    const { [key]: _, ...rest } = filters;
    setFilters(rest);
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
                {getFilterLabel(filter.key)}:{' '}
                <span
                  onClick={() =>
                    handleFilterArrayChange(filter.key, filter.value as string)
                  }
                  className="cursor-pointer bg-gray-200 py-2 px-2 text-slate-700 rounded-xl text-xs flex items-center gap-2"
                >
                  {getFilterValueLabel(filter.key, filter.value)}
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
