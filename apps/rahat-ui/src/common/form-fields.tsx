import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { cn } from '@rahat-ui/shadcn/src';
import { forwardRef } from 'react';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { SelectTrigger } from '@rahat-ui/shadcn/src/components/ui/select';
import { useFormField } from '@rahat-ui/shadcn/src/components/ui/form';

const FILLED_CLASSES = 'shadow-[inset_4px_0_0_0_hsl(var(--primary))] bg-blue-50';
const ERROR_CLASSES = 'shadow-[inset_4px_0_0_0_hsl(var(--destructive))] bg-red-50 focus-visible:ring-2 focus-visible:ring-destructive';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string | number | readonly string[] | undefined;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ value, className, ...props }, ref) => {
    const { error } = useFormField();
    const isFilled = !!value && String(value).trim() !== '';

    return (
      <Input
        ref={ref}
        {...props}
        value={value}
        className={cn(
          isFilled && !error && FILLED_CLASSES,
          error && ERROR_CLASSES,
          className
        )}
      />
    );
  },
);

FormInput.displayName = 'FormInput';

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ value, className, ...props }, ref) => {
    const { error } = useFormField();
    const isFilled = !!value && String(value).trim() !== '';
    return (
      <Textarea
        ref={ref}
        {...props}
        value={value}
        className={cn(
          isFilled && !error && FILLED_CLASSES,
          error && ERROR_CLASSES,
          className
        )}
      />
    );
  },
);

FormTextarea.displayName = 'FormTextarea';

interface FormSelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectTrigger> {
  value?: string;
}

const FormSelectTrigger = forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  FormSelectTriggerProps
>(({ value, className, children, ...props }, ref) => {
  const { error } = useFormField();
  const isFilled = !!value && String(value).trim() !== '';

  return (
    <SelectTrigger
      ref={ref}
      {...props}
      className={cn(
        isFilled && !error && FILLED_CLASSES,
        error && ERROR_CLASSES,
        className
      )}
    >
      {children}
    </SelectTrigger>
  );
});

FormSelectTrigger.displayName = 'FormSelectTrigger';

export { FormInput, FormTextarea, FormSelectTrigger };
