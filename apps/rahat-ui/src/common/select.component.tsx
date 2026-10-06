import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

type SelectOption = string | { label: string; value: string };

type Iprops = {
  className?: string;
  name?: string;
  options?: Array<SelectOption>;
  labels?: Record<string, string>;
  value?: string;
  onChange?: (value: string) => void;
};

const titleCase = (status: string) => {
  if (typeof status !== 'string') return String(status || '');
  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function SelectComponent({
  className = '',
  name,
  options,
  labels,
  value,
  onChange,
}: Iprops) {
  const t = useTranslations('GLOBAL');
  const contentClassName = name === 'Group Type' ? 'h-30 ' : 'h-32';
  const translatedName = name ? translateValue(t, name, { fallback: name, silent: true }) : '';
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={name ? t('SELECT_PLACEHOLDER', { name: translatedName }) : t('SELECT')} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        <SelectGroup>
          {options?.map((item: any) => {
            const val = typeof item === 'object' && item !== null ? item.value : item;
            const label =
              typeof item === 'object' && item !== null
                ? item.label
                : (labels?.[val] ?? translateValue(t, val, { fallback: titleCase(val), silent: true }));
            return (
              <SelectItem value={val} key={val}>
                {label}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
