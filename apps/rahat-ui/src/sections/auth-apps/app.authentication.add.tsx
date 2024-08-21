'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateAuthApp } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { FormField } from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { useForm } from 'react-hook-form';
import { isAddress } from 'viem';
import { z } from 'zod';

export default function AddAppAuthentication() {
  const createAuthApp = useCreateAuthApp();

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    address: z.string().refine(
      (value) => {
        if (isAddress(value)) return true;
      },
      {
        message: 'Invalid app address',
      },
    ),
    description: z.string().optional(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      address: '',
      description: '',
    },
  });

  const handleAddAppAuthentication = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    await createAuthApp.mutateAsync(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleAddAppAuthentication)}>
      <div className="p-4 h-add rounded border bg-white">
        <h1 className="text-lg font-semibold mb-6">Add New</h1>
        <div className="shadow-md p-4 rounded-sm">
          <div className="grid grid-cols-2 gap-5 mb-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <div className="col-span-1">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter app name"
                    className=" mt-4 "
                    {...field}
                  />

                  {errors.name && (
                    <Label className="text-red-500">
                      {errors.name.message}
                    </Label>
                  )}
                </div>
              )}
            />

            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <div className="col-span-1">
                  <Label>Address</Label>
                  <Input
                    type="text"
                    placeholder="Enter app address"
                    className=" mt-4 "
                    {...field}
                  />

                  {errors.address && (
                    <Label className="text-red-500">
                      {errors.address.message}
                    </Label>
                  )}
                </div>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <div className="col-span-1">
                  <Label>Description</Label>
                  <Input
                    type="text"
                    placeholder="Short description about app"
                    className=" mt-4 "
                    {...field}
                  />

                  {errors.description && (
                    <Label className="text-red-500">
                      {errors.description.message}
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
