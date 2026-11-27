import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { FormSelectTrigger } from 'apps/rahat-ui/src/common/form-fields';

type IProps = {
  form: any;
  name: string;
  className?: string;
  label: string;
  subLabel?: string;
  placeholder: string;
  selectItems: Array<{ value: string; label: string; isDisabled?: boolean }>;
  required?: boolean;
};

export default function SelectFormField({
  form,
  name,
  className = '',
  label,
  subLabel,
  placeholder,
  selectItems,
  required = false,
}: IProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={className}>
            <FormLabel required={required}>
              {label}
              {subLabel && (
                <p className="text-sm text-muted-foreground font-normal">
                  {subLabel}
                </p>
              )}
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={form.watch(name)}
            >
              <FormControl>
                <FormSelectTrigger value={field.value}>
                  <SelectValue placeholder={placeholder} />
                </FormSelectTrigger>
              </FormControl>
              <SelectContent>
                {selectItems && selectItems.length > 0 ? (
                  selectItems.map((item, index) => (
                    <SelectItem
                      key={index}
                      value={item.value}
                      disabled={item.isDisabled || false}
                    >
                      {item.label}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-4 py-2 text-muted-foreground text-sm">
                    No options available
                  </div>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
