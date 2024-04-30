import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { humanizeString } from '../utils';
import useTargetingFormStore from './form.store';

export default function DropDownInput({ formField }: any) {
  const { targetingQueries, setTargetingQueries }: any =
    useTargetingFormStore();

  const handleInputChange = (d: string) => {
    let item = {} as any;
    item[formField.name] = d;
    const formData = { ...targetingQueries, ...item };
    setTargetingQueries(formData);
  };

  const options = formField?.fieldPopulate?.data || ([] as any);
  const defaultData = targetingQueries[formField.name] || '';

  return (
    <div>
      <Label>{humanizeString(formField.name)}</Label>
      <Select value={defaultData} onValueChange={handleInputChange}>
        <SelectTrigger className="w-60">
          <SelectValue placeholder="Select Option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.length > 0
              ? options.map((d: any, index: number) => {
                  return (
                    <SelectItem key={index} value={d.value}>
                      {humanizeString(d.label)}
                    </SelectItem>
                  );
                })
              : 'No Options'}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
