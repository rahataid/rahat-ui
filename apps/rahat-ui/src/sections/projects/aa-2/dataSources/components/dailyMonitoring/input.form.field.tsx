import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { FormInput } from 'apps/rahat-ui/src/common/form-fields';
import { toAsciiDigits } from 'apps/rahat-ui/src/utils/i18n/numeral';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';

type IProps = {
  form: any;
  name: string;
  label: string;
  subLabel?: string;
  placeholder: string;
  required?: boolean;
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
  required = false,
}: IProps) {
  const formatDigits = useLabelDigits();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel required={required}>
              {label}
              {subLabel && (
                <p className="text-sm text-muted-foreground font-normal">
                  {subLabel}
                </p>
              )}
            </FormLabel>
            <FormControl>
              <FormInput
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
