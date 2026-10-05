import * as React from 'react';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src';
import { useTranslations } from 'next-intl';

type IProps = {
  name?: string;
  placeholder?: string;
  className?: string;
  onSearch:
  | VoidFunction
  | ((event: React.ChangeEvent<HTMLInputElement>) => void);
  isDisabled?: boolean;
  value?: string;
};

export default function SearchInput({
  name = 'search',
  placeholder,
  className,
  onSearch,
  isDisabled = false,
  value,
}: IProps) {
  const t = useTranslations('GLOBAL');

  const resolvedPlaceholder = React.useMemo(() => {
    if (placeholder) return placeholder;
    if (!name || name === 'search') {
      return t('SEARCH_PLACEHOLDER', { name: '' }).replace(/\s+\.\.\./, '...');
    }
    const trimmed = name.trim();
    if (
      trimmed.toLowerCase().startsWith('search') ||
      trimmed.includes('खोज्नुहोस्')
    ) {
      return trimmed;
    }
    return t('SEARCH_PLACEHOLDER', { name: trimmed });
  }, [placeholder, name, t]);

  return (
    <div className={cn('relative', className)}>
      <Search
        size={18}
        strokeWidth={2.5}
        className="absolute left-2 top-3 text-muted-foreground"
      />
      <Input
        name={name}
        placeholder={resolvedPlaceholder}
        className="pl-8"
        value={value}
        onChange={onSearch}
        disabled={isDisabled}
      />
    </div>
  );
}
