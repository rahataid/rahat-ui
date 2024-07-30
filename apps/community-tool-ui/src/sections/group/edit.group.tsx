'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCommunityGroupUpdate } from '@rahat-ui/community-query';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Minus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type IProps = {
  data: any;
  closeSecondPanel: VoidFunction;
};

export default function EditGroup({ data, closeSecondPanel }: IProps) {
  const communityGroup = useCommunityGroupUpdate();

  const FormSchema = z.object({
    name: z
      .string()
      .min(3, { message: 'Group name must be at least 3 character' }),
    isSystem: z.boolean(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name || '',
      isSystem: data?.isSystem || false,
    },
  });

  const updateGroupDetails = async (formData: z.infer<typeof FormSchema>) => {
    await communityGroup.mutateAsync({
      uuid: data.uuid,
      data: formData,
    });
    closeSecondPanel();
  };

  console.log('UUID=>', data.uuid);

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <div className="flex gap-4">
          {' '}
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger onClick={closeSecondPanel}>
                <Minus size={20} strokeWidth={1.5} />
              </TooltipTrigger>
              <TooltipContent className="bg-secondary ">
                <p className="text-xs font-medium">Close</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div>
            <p>
              <b>Update Group</b>
            </p>
          </div>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(updateGroupDetails)}>
          <div className="p-4 h-add">
            {/* <h1 className="text-lg font-semibold mb-6">Basic Details</h1> */}
            <div
              style={{ maxHeight: '62vh' }}
              className="grid grid-cols-2 gap-4 mb- overflow-y-auto"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            type="text"
                            placeholder="Group name"
                            {...field}
                            onChange={(e) => {
                              form.setValue('name', e.target.value);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="mt-5">
              <Button>Submit</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
