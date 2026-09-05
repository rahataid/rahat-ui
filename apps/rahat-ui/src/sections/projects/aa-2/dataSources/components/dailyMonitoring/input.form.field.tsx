import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { toAsciiDigits } from 'apps/rahat-ui/src/utils/i18n/numeral';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';

type IProps = {
  form: any;
  name: string;
  label: string;
  subLabel?: string;
  placeholder: string;
};

// Every current field rendered through this component is a numeric
// measurement value (GLOFAS readings, gauge/water level, forecast
// percentiles), so digits are normalized to ASCII on input and shown as
// Devanagari in the ne locale — same as the rest of the app's number fields.
export default function InputFormField({
  form,
  name,
  label,
  subLabel,
  placeholder,
}: IProps) {
  const formatDigits = useLabelDigits();
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
              <Input
                placeholder={placeholder}
                {...field}
                value={formatDigits(field.value ?? '')}
                onChange={(e) =>
                  field.onChange(toAsciiDigits(e.target.value))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
