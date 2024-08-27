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
import AddButton from '../../../components/add.btn';
import { UUID } from 'crypto';
import SearchInput from '../../../components/search.input';
import { ACTIVITY_STATUS } from '../../aa.constants';
import DownloadReportBtn from 'apps/rahat-ui/src/components/download.report.btn';

const { NOT_STARTED, WORK_IN_PROGRESS, COMPLETED, DELAYED } = ACTIVITY_STATUS;
const statusList = [NOT_STARTED, WORK_IN_PROGRESS, COMPLETED, DELAYED];

type IProps = {
  handleFilter: (key: string, value: string) => void;
  projectID: UUID;
  handleSearch: (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string,
  ) => void;
  handleDownload: VoidFunction;
  activity: string;
  responsibility: string;
  phase: string;
  category: string;
  status: string;
};

export default function ActivitiesTableFilters({
  handleFilter,
  projectID,
  handleSearch,
  handleDownload,
  activity,
  responsibility,
  phase,
  category,
  status,
}: IProps) {
  const { categories, phases } = useActivitiesStore((state) => ({
    categories: state.categories,
    phases: state.phases,
  }));

  return (
    <div className="flex items-center gap-2 mb-2">
      {/* Search Activities  */}
      <SearchInput
        className="w-full"
        value={activity}
        name="Activities"
        onSearch={(e) => handleSearch(e, 'title')}
      />
      {/* Filter Phases */}
      <Select
        value={phase}
        onValueChange={(value) => handleFilter('phase', value)}
      >
        <SelectTrigger className={phase ? '' : 'text-muted-foreground'}>
          <SelectValue placeholder="Select a phase" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Phases</SelectItem>
            {phases.map((item) => (
              <SelectItem key={item.id} value={item.uuid}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {/* Filter Category */}
      <Select
        value={category}
        onValueChange={(value) => handleFilter('category', value)}
      >
        <SelectTrigger className={category ? '' : 'text-muted-foreground'}>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((item) => (
              <SelectItem key={item.id} value={item.uuid}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {/* Filter Status  */}
      <Select
        value={status}
        onValueChange={(value) => handleFilter('status', value)}
      >
        <SelectTrigger className={status ? '' : 'text-muted-foreground'}>
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Status</SelectItem>
            {statusList.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {/* Search Responsibilities  */}
      <SearchInput
        className="w-full"
        value={responsibility}
        name="Responsiblity"
        onSearch={(e) => handleSearch(e, 'responsibility')}
      />
      {/* Download report btn  */}
      <DownloadReportBtn handleDownload={handleDownload} />
      {/* Add Activities Btn */}
      <AddButton
        path={`/projects/aa/${projectID}/activities/add`}
        name="Activities"
      />
    </div>
  );
}
