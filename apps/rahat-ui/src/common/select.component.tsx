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
  value?: string;
  onChange?: (value: string) => void;
};

export default function SelectComponent({
  className = '',
  name,
  options,
  value,
  onChange,
}: Iprops) {
  const contentClassName = name === 'Group Type' ? 'h-30 ' : 'h-32';
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={`Select ${name}`} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        <SelectGroup>
          {options?.map((status: string) => (
            <SelectItem value={status} key={status}>
              {status
                .toLowerCase()
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
