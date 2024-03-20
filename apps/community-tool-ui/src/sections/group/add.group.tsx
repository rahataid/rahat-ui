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
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRumsanService } from '../../providers/service.provider';

function AddGroup() {
  const FormSchema = z.object({
    name: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  });
  const { communityGroupQuery } = useRumsanService();
  const communityGroup = communityGroupQuery.useCommunityGroupCreate();

  const handleForm = async (data: z.infer<typeof FormSchema>) => {
    await communityGroup.mutateAsync(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleForm)}>
        <div className="h-custom p-4">
          <div className="w-full -mt-2 p-2 bg-secondary">
            <div className="rounded border bg-white p-4">
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
        </div>
      </form>
    </Form>
  );
}

export default AddGroup;
