import { useTranslations } from 'next-intl';
import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@rahat-ui/shadcn/components/select';
import { useActivitiesStore } from '@rahat-ui/query';
import { UUID } from 'crypto';

import { ACTIVITY_STATUS } from 'apps/rahat-ui/src/constants/aa.constants';
import { SearchInput } from 'apps/rahat-ui/src/common';

const { NOT_STARTED, WORK_IN_PROGRESS, COMPLETED, DELAYED } = ACTIVITY_STATUS;
const statusList = [NOT_STARTED, WORK_IN_PROGRESS, COMPLETED, DELAYED];
type IProps = {
  handleFilter: (key: string, value: string) => void;
  projectID: UUID;
  handleSearch: (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string,
  ) => void;
  activity: string;
  responsibility: string;
  category: string;
  status: string;
  isAutomated: string;
};

export default function ActivitiesTableFilters({
  handleFilter,
  projectID,
  handleSearch,
  activity,
  responsibility,
  category,
  status,
  isAutomated,
}: IProps) {
  const tGlobal = useTranslations('GLOBAL');
  const t = useTranslations('AA Project');
  const { categories } = useActivitiesStore((state) => ({
    categories: state.categories,
  }));

  return (
    <div className="flex items-center gap-2 mb-2">
      {/* Search Activities  */}
      <SearchInput
        className="w-full"
        value={activity}
        name={tGlobal('ACTIVITIES')}
        onSearch={(e) => handleSearch(e, 'title')}
      />
      {/* Filter Category */}
      <Select
        value={category}
        onValueChange={(value) => handleFilter('category', value)}
      >
        <SelectTrigger className={category ? '' : 'text-muted-foreground'}>
          <SelectValue placeholder={t('SELECT_A_CATEGORY')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">{t('ALL_CATEGORIES')}</SelectItem>
            {categories.map((item) => (
              <SelectItem key={item.id} value={item.uuid}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Filter Type */}
      <Select
        value={isAutomated}
        onValueChange={(value) => handleFilter('isAutomated', value)}
      >
        <SelectTrigger className={isAutomated ? '' : 'text-muted-foreground'}>
          <SelectValue placeholder={t('SELECT_ACTIVITY_TYPE')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">{t('ALL_TYPE')}</SelectItem>
            <SelectItem value={'true'}>{t('AUTOMATED')}</SelectItem>
            <SelectItem value={'false'}>{t('MANUAL')}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Filter Status  */}
      <Select
        value={status}
        onValueChange={(value) => handleFilter('status', value)}
      >
        <SelectTrigger className={status ? '' : 'text-muted-foreground'}>
          <SelectValue placeholder={t('SELECT_A_STATUS')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">{t('ALL_STATUS')}</SelectItem>
            {statusList.map((status) => (
              <SelectItem key={status} value={status}>
                {status
                  .toLowerCase()
                  .split('_')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {/* Search Responsibilities  */}
      <SearchInput
        className="w-full"
        value={responsibility}
        name={tGlobal('RESPONSIBILITY')}
        onSearch={(e) => handleSearch(e, 'responsibility')}
      />
    </div>
  );
}
