import * as React from 'react';
import { Input } from 'libs/shadcn/src/components/ui/input';
import { Search, X } from 'lucide-react';
import { cn } from 'libs/shadcn/src';

type IProps = {
  name: string;
  className?: string;
  placeholder?: string;
  onSearch:
    | VoidFunction
    | ((event: React.ChangeEvent<HTMLInputElement>) => void);
  isDisabled?: boolean;
  value?: string;
};

export function SearchInput({
  name,
  className,
  placeholder,
  onSearch,
  isDisabled = false,
  value,
}: IProps) {
  const handleClear = () => {
    const event = {
      target: { name, value: '' },
    } as React.ChangeEvent<HTMLInputElement>;
    onSearch(event);
  };
  return (
    <div className={cn('relative', className)}>
      <Search
        size={18}
        strokeWidth={2.5}
        className="absolute left-2 top-3 text-muted-foreground"
      />
      <Input
        name={name}
        placeholder={placeholder || `Search ${name}...`}
        className="pl-8"
        value={value}
        onChange={onSearch}
        disabled={isDisabled}
      />
      {value && (
        <X
          size={18}
          strokeWidth={2.5}
          color="black"
          className="absolute right-2 top-3 text-muted-foreground cursor-pointer border rounded-full "
          onClick={handleClear}
        />
      )}
    </div>
  );
}
