import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { humanizeString } from '../utils';
import useFormStore from './form.store';

const items = [
  {
    id: 'applications',
    label: 'Applications',
  },
  {
    id: 'desktop',
    label: 'Desktop',
  },
  {
    id: 'downloads',
    label: 'Downloads',
  },
  {
    id: 'documents',
    label: 'Documents',
  },
] as const;

let checkedItems = [] as any;
export default function CheckboxInput({ formField }: any) {
  const { extras, setExtras }: any = useFormStore();
  const handleCheckedChange = (checked: boolean, data: any) => {
    let item = {} as any;
    if (checked) checkedItems = [...checkedItems, data.id];
    if (!checked)
      checkedItems = checkedItems.filter((item: any) => item !== data.id);
    item[formField.name] = checkedItems.length ? checkedItems.toString() : '';
    const formData = { ...extras, ...item };
    setExtras(formData);
  };
  return (
    <div>
      <Label>{humanizeString(formField.name)}</Label> <br />
      <FormItem>
        {items.map((item) => (
          <FormField
            key={item.id}
            name="items"
            render={({ field }) => {
              return (
                <FormItem
                  key={item.id}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      onCheckedChange={(checked) =>
                        handleCheckedChange(checked, item)
                      }
                      checked={field.value?.includes(item.id)}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{item.label}</FormLabel>
                </FormItem>
              );
            }}
          />
        ))}
      </FormItem>{' '}
    </div>
  );
}
