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
  optionLabels?: Record<string, string>;
  value?: string;
  onChange?: (value: string) => void;
};

export default function SelectComponent({
  className = 'w-full',
  name,
  options,
  optionLabels,
  value,
  onChange,
}: Iprops) {
  const t = useTranslations('GLOBAL');
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={t('SELECT_PLACEHOLDER', { name })} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options?.map((o: string) => (
            <SelectItem key={o} value={o}>{optionLabels?.[o] ?? o}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
