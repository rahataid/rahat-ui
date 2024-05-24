import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src';

type IProps = {
  className?: string;
  onSearch: VoidFunction;
  isDisabled: boolean;
};

export default function SearchInput({
  className,
  onSearch,
  isDisabled,
}: IProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        size={18}
        strokeWidth={2.5}
        className="absolute left-2 top-3 text-muted-foreground"
      />
      <Input
        placeholder="Search Trigger Statements..."
        className="pl-8"
        onChange={onSearch}
        disabled={isDisabled}
      />
    </div>
  );
}
