import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';

type Iprops = {
  name: string;
  options?: Array<string>;
  value?: string;
  onChange?: (value: string) => void;
};

export default function SelectComponent({
  name,
  options,
  value,
  onChange,
}: Iprops) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${name}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options?.map((o: string) => (
            <SelectItem value={o}>{o}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
