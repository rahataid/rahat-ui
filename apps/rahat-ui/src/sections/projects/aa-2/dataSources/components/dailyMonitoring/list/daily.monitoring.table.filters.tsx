import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@rahat-ui/shadcn/components/select';
import { useSelectItems } from '../useSelectItems';
import { Calendar } from '@rahat-ui/shadcn/src/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { cn } from '@rahat-ui/shadcn/src';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { SearchInput } from 'apps/rahat-ui/src/common';

type IProps = {
  user: string;
  location: string;
  date: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilter: (key: string, value: any) => void;
};

type ISelectComponent = {
  name: string;
  options: Array<any>;
  value: string;
  handleFilter: (key: string, value: string) => void;
};

const SelectComponent = ({
  name,
  options,
  value,
  handleFilter,
}: ISelectComponent) => {
  return (
    <Select value={value} onValueChange={(value) => handleFilter(name, value)}>
      <SelectTrigger>
        <SelectValue placeholder={`Select a ${name}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">All</SelectItem>
          {options.map((item) => (
            <SelectItem key={item.label} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default function DailyMonitoringTableFilters({
  user,
  location,
  date,
  handleSearch,
  handleFilter,
}: IProps) {
  const { riverBasins } = useSelectItems();
  return (
    <div className="flex items-center gap-2 w-full">
      <SearchInput
        className="w-full"
        name="user"
        value={user}
        onSearch={handleSearch}
      />
      {/* Filter River Basin  */}
      <SelectComponent
        name="location"
        value={location}
        options={riverBasins}
        handleFilter={handleFilter}
      />
      {/* Filter Date  */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={new Date(date)}
            onSelect={(date) => handleFilter('createdAt', date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {date && (
        <Button type="button" onClick={() => handleFilter('createdAt', '')}>
          Clear date
        </Button>
      )}
    </div>
  );
}
