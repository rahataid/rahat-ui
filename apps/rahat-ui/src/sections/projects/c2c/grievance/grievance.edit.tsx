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
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function EditGrievance({ grievance }: any) {
  const { closeSecondPanel } = useSecondPanel();

  const FormSchema = z.object({
    title: z
      .string()
      .min(2, { message: 'Title must be at least 2 characters long' }),
    type: z
      .string()
      .min(3, { message: 'Type must be at least 3 characters long' }),
    reportedBy: z.string().optional(),
    createdAt: z.string().optional(),
    description: z
      .string()
      .min(10, { message: 'Description must be at least 10 characters long' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: grievance?.title,
      type: grievance?.type,
      reportedBy: grievance?.reportedBy,
      createdAt: grievance?.createdAt,
      description: grievance?.description,
    },
  });

  //   const handleEditGrievance = async (data: z.infer<typeof FormSchema>) => {
  //     try {
  //       await updateGrievance.mutateAsync({
  //         uuid: grievance.uuid,
  //         title: data.title,
  //         type: data.type,
  //         reportedBy: data.reportedBy,
  //         createdAt: data.createdAt,
  //         description: data.description,
  //       });
  //     } catch (e) {
  //       console.error('Error:', e);
  //     }
  //   };

  //   useEffect(() => {
  //     updateGrievance.isSuccess && closeSecondPanel();
  //   }, [updateGrievance]);

  return (
    <Form {...form}>
      <form
      //   onSubmit={form.handleSubmit(handleEditGrievance)}
      >
        <div className="p-4">
          <h1 className="text-md font-semibold mb-6">Edit Grievance</h1>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="Type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reportedBy"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="Created By" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="Created On" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Update Grievance</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
