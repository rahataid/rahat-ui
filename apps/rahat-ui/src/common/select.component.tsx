import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';

type Iprops = {
  className?: string;
  name: string;
  options?: Array<string>;
  labels?: Record<string, string>;
  value?: string;
  onChange?: (value: string) => void;
};

const titleCase = (status: string) =>
  status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

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
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={t('SELECT_PLACEHOLDER', { name })} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        <SelectGroup>
          {options?.map((status: string) => (
            <SelectItem value={status} key={status}>
              {labels?.[status] ?? titleCase(status)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
