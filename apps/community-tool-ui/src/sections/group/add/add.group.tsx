'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCommunityGroupCreate } from '@rahat-ui/community-query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

function AddGroup() {
  const FormSchema = z.object({
    name: z.string().min(3, 'Group name is required'),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  });
  const communityGroup = useCommunityGroupCreate();

  const handleForm = async (data: z.infer<typeof FormSchema>) => {
    await communityGroup.mutateAsync(data);
  };

  useEffect(() => {
    if (communityGroup.isSuccess) {
      form.reset();
    }
  }, [communityGroup.isSuccess, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleForm)}>
        <div className="h-add p-4">
          <h1 className="text-lg font-semibold mb-6">Add Group</h1>
          <div className="shadow-md p-4 rounded-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex justify-end">
              <Button>Create Group</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default AddGroup;
