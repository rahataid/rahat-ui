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
  options?: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  showSelect?: boolean;
};

export default function SelectComponent({
  className = 'w-full',
  name,
  options,
  value,
  onChange,
  showSelect = true,
}: Iprops) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={showSelect ? `Select ${name}` : `${name}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options?.map((o) => (
            <SelectItem value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
