import * as React from 'react';
import { Input } from 'libs/shadcn/src/components/ui/input';
import { Search, X } from 'lucide-react';
import { cn } from 'libs/shadcn/src';

type IProps = {
  name: string;
  className?: string;
  inputClassName?: string;
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
  inputClassName,
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
        className="absolute left-2 top-2 text-muted-foreground"
      />
      <Input
        name={name}
        placeholder={placeholder || `Search ${name}...`}
        className={cn(
          'pl-8 h-[clamp(32px,3.5vw,40px)] text-[clamp(11px,1vw,14px)]',
          inputClassName,
        )}
        value={value}
        onChange={onSearch}
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

