import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

type IProps = {
  form: any;
  name: string;
  label: string;
  subLabel?: string;
  placeholder: string;
};

export default function InputFormField({
  form,
  name,
  label,
  subLabel,
  placeholder,
}: IProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>
              {label}
              {subLabel && (
                <p className="text-sm text-muted-foreground font-normal">
                  {subLabel}
                </p>
              )}
            </FormLabel>
            <FormControl>
              <Input placeholder={placeholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
