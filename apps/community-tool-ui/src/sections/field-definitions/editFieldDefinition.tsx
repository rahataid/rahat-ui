'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { FieldType } from '../../types/fieldDefinition';

import { FieldDefinition } from '@rahataid/community-tool-sdk/fieldDefinitions';
import {
  useFieldDefinitionsUpdate,
  useFieldDefinitionsStatusUpdate,
} from '@rahat-ui/community-query';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';

export default function EditFieldDefinition({
  data,
}: {
  data: FieldDefinition;
}) {
  const updateFieldDefinition = useFieldDefinitionsUpdate();
  const updateFieldDefinitionStatus = useFieldDefinitionsStatusUpdate();

  const FormSchema = z.object({
    name: z.string(),
    fieldType: z.string().toUpperCase(),
    isActive: z.boolean(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name || '',
      fieldType: data?.fieldType || '',
      isActive: data?.isActive || false,
    },
  });

  const handleEditFieldDefinition = async (
    formData: z.infer<typeof FormSchema>,
  ) => {
    await updateFieldDefinition.mutateAsync({
      id: data?.id?.toString(),
      data: {
        id: data?.id,
        name: formData?.name,
        fieldType: formData?.fieldType as FieldType,
        isActive: formData?.isActive,
      },
    });
  };

  const handleStatusChange = async (isActive: any) => {
    await updateFieldDefinitionStatus.mutateAsync({
      id: data?.id?.toString(),
      isActive: isActive,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditFieldDefinition)}>
        <div className="p-4 h-add">
          <h1 className="text-lg font-semibold mb-6">
            Update Field Definition
          </h1>
          <div className="shadow-md p-4 rounded-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label className="text-xs font-medium">Name</Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Name"
                          {...field}
                          onChange={(e) => {
                            form.setValue('name', e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="fieldType"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label className="text-xs font-medium">Field Type</Label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Field Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={FieldType.TEXT}>TEXT</SelectItem>
                          <SelectItem value={FieldType.NUMBER}>
                            NUMBER
                          </SelectItem>
                          <SelectItem value={FieldType.CHECKBOX}>
                            CHECKBOX
                          </SelectItem>
                          <SelectItem value={FieldType.DROPDOWN}>
                            DROPDOWN
                          </SelectItem>
                          <SelectItem value={FieldType.PASSWORD}>
                            PASSWORD
                          </SelectItem>
                          <SelectItem value={FieldType.RADIO}>RADIO</SelectItem>
                          <SelectItem value={FieldType.TEXTAREA}>
                            TEXTAREA
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <div className="flex flex-col justify-evenly items-left">
                    <Label className="text-xs font-medium">isActive</Label>
                    <Switch
                      {...field}
                      value={field.value ? 'false' : 'true'}
                      checked={field.value}
                      onCheckedChange={(isChecked) => {
                        handleStatusChange({
                          isActive: isChecked,
                        });
                      }}
                    />
                  </div>
                )}
              />
            </div>
            {/* <div className="flex justify-end">
              <Button>Update Field Definition</Button>
            </div> */}
          </div>
        </div>
      </form>
    </Form>
  );
}
