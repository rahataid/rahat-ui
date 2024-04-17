import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useForm } from 'react-hook-form';
import React from 'react';

interface FormValues {
  [key: string]: string | undefined;
}

export default function TargetSelectForm() {
  const fields: { [key: string]: string[] } = {
    SSA: ['Old Citizen', 'Widowed', 'Childern under 5 (Dalit)'],
    Vulnerability: ['Pregnant', 'Lactating'],
    Gender: ['Male', 'Female', 'Other'],
    PhoneType: ['Mobile', 'Landline', 'Feature Phone', 'Smartphone'],
    BankedStatus: ['Banked', 'Unbanked', 'Underbanked'],
    Location: ['Morang', 'Kathmandu', 'Chitwan', 'Pokhara'],
  };

  const { handleSubmit, control, reset } = useForm<FormValues>();

  const form = useForm({
    defaultValues: {
      SSA: fields.SSA[0],
      Vulnerability: fields.Vulnerability[0],
      Gender: fields.Gender[0],
      PhoneType: fields.PhoneType[0],
      BankedStatus: fields.BankedStatus[0],
      Location: fields.Location[0],
    },
  });

  const handleTargetSubmit = (data: FormValues) => {
    // console.log('Selected Fields:', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleTargetSubmit)}>
        <div className="m-2">
          {Object.entries(fields).map(([fieldName, options], index) => (
            <React.Fragment key={index}>
              <FormField
                control={control}
                name={fieldName}
                render={({ field }) => {
                  return (
                    <div className="mb-2">
                      <Label>{fieldName}</Label>
                      <FormItem>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={`Select ${fieldName}`}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    </div>
                  );
                }}
              />
            </React.Fragment>
          ))}
          <div className="mt-4">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
