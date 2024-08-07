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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export default function CheckboxInput({ formField }: any) {
  const { extras, setExtras }: any = useFormStore();

  const handleCheckedChange = (checked: boolean, data: any) => {
    let item = {} as any;
    if (checked) {
      const existing = extras[formField.name];
      item[formField.name] = existing
        ? `${existing},${data.value}`
        : data.value;
    }
    if (!checked) {
      const existing = extras[formField.name];
      const arrData = existing.split(',');
      const filtered = arrData.filter((f: any) => f !== data.value);
      item[formField.name] = filtered.toString();
    }
    const formData = { ...extras, ...item };
    setExtras(formData);
  };

  const options = formField?.fieldPopulate?.data || ([] as any);
  const defaultData = extras[formField.name] || '';

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Label>{humanizeString(formField.name)}</Label>
          </TooltipTrigger>
          <TooltipContent>
            <p>{formField.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>{' '}
      <br />
      <FormItem>
        {options.length > 0
          ? options.map((item: any) => (
              <FormField
                key={item.value}
                name={formField.name}
                render={({ field }) => {
                  const arrayData = defaultData ? defaultData.split(',') : [];
                  const isChecked = arrayData.includes(item.value);

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
                          checked={isChecked}
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
