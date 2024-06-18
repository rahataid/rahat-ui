import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@rahat-ui/shadcn/components/select';
import SearchInput from '../../../../components/search.input';

type IProps = {
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilter: (key: string, value: string) => void;
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
            <SelectItem key={item.id} value={item.uuid}>
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default function DailyMonitoringTableFilters({
  handleSearch,
  handleFilter,
}: IProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      <SearchInput
        className="w-full"
        name="data entry"
        onSearch={handleSearch}
      />
      {/* Filter Date  */}
      <SelectComponent
        name="date"
        value=""
        options={[]}
        handleFilter={handleFilter}
      />
      {/* Filter User  */}
      <SelectComponent
        name="user"
        value=""
        options={[]}
        handleFilter={handleFilter}
      />
      {/* Filter River Basin  */}
      <SelectComponent
        name="river basin"
        value=""
        options={[]}
        handleFilter={handleFilter}
      />
      {/* Filter Source  */}
      <SelectComponent
        name="source"
        value=""
        options={[]}
        handleFilter={handleFilter}
      />
    </div>
  );
}
