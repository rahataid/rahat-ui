import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@rahat-ui/shadcn/src/components/ui/select';

type IProps = {
  form: any;
  name: string;
  className?: string;
  label: string;
  subLabel?: string;
  placeholder: string;
  selectItems: Array<{ value: string; label: string; isDisabled?: boolean }>;
};

export default function SelectFormField({
  form,
  name,
  className = '',
  label,
  subLabel,
  placeholder,
  selectItems,
}: IProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={className}>
            <FormLabel>
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
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {selectItems?.map((item, index) => (
                  <SelectItem
                    key={index}
                    value={item.value}
                    disabled={item.isDisabled || false}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
