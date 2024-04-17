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

let checkedItems = [] as any;

export default function CheckboxInput({ formField }: any) {
  const { extras, setExtras }: any = useFormStore();

  const handleCheckedChange = (checked: boolean, data: any) => {
    let item = {} as any;
    if (checked) checkedItems = [...checkedItems, data.value];
    if (!checked)
      checkedItems = checkedItems.filter((item: any) => item !== data.value);
    item[formField.name] = checkedItems.length ? checkedItems.toString() : '';
    const formData = { ...extras, ...item };
    setExtras(formData);
  };

  const options = formField?.fieldPopulate?.data || ([] as any);

  return (
    <div>
      <Label>{humanizeString(formField.name)}</Label> <br />
      <FormItem>
        {options.length > 0
          ? options.map((item: any) => (
              <FormField
                key={item.value}
                name={formField.name}
                render={({ field }) => {
                  return (
                    <FormItem
                      key={item.value}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          onCheckedChange={(checked: boolean) =>
                            handleCheckedChange(checked, item)
                          }
                          checked={field.value?.includes(item.value)}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))
          : 'No Options!'}
      </FormItem>{' '}
    </div>
  );
}
