import * as React from 'react';
import { Input } from 'libs/shadcn/src/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from 'libs/shadcn/src';

type IProps = {
  name: string;
  className?: string;
  onSearch:
    | VoidFunction
    | ((event: React.ChangeEvent<HTMLInputElement>) => void);
  isDisabled?: boolean;
  value?: string;
};

export function SearchInput({
  name,
  className,
  onSearch,
  isDisabled = false,
  value,
}: IProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        size={18}
        strokeWidth={2.5}
        className="absolute left-2 top-3 text-muted-foreground"
      />
      <Input
        name={name}
        placeholder={`Search ${name}...`}
        className="pl-8"
        value={value}
        onChange={onSearch}
        disabled={isDisabled}
      />
    </div>
  );
}
