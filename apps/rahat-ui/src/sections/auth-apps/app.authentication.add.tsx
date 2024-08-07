'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { FormField } from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function AddAppAuthentication() {
  const FormSchema = z.object({
    appName: z.string().min(1, { message: 'Name is required' }),
    publicKey: z.string(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      appName: '',
      publicKey: '',
    },
  });

  const handleAddAppAuthentication = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(handleAddAppAuthentication)}>
      <div className="p-4 h-add rounded border bg-white">
        <h1 className="text-lg font-semibold mb-6">Add App Authentication</h1>
        <div className="shadow-md p-4 rounded-sm">
          <div className="grid grid-cols-1 gap-5 mb-4">
            <FormField
              control={control}
              name="appName"
              render={({ field }) => (
                <div className="col-span-1">
                  <Label>App Name</Label>
                  <Input
                    type="text"
                    placeholder="App Name"
                    className="w-fit mt-4 "
                    {...field}
                  />

                  {errors.appName && (
                    <Label className="text-red-500">
                      {errors.appName.message}
                    </Label>
                  )}
                </div>
              )}
            />

            <FormField
              control={control}
              name="publicKey"
              render={({ field }) => (
                <div className="col-span-1">
                  <Label>Public Key</Label>
                  <Input
                    type="text"
                    placeholder="Public Key"
                    className="w-min mt-4 "
                    {...field}
                  />

                  {errors.appName && (
                    <Label className="text-red-500">
                      {errors.appName.message}
                    </Label>
                  )}
                </div>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </div>
      </div>
    </form>
  );
}
